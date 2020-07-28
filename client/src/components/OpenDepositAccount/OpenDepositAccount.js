import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Spin, Select, message } from 'antd';
import { connect } from 'react-redux';
import { find, debounce } from 'lodash';
import moment from 'moment';
import { getUser } from '../../selectors/UserSelectors';
import {
  fetchAccount,
  getDepositTerms,
  registerDepositRequest,
  registerDepositConfirm
} from '../../actions/CustomerActions';
import { formatMoney, getErrorMessage } from '../../utils/helpers';
import { fetchAll } from '../../utils/api';
import {
  MIN_DEPOSIT_AMOUNT,
  DATE_FORMAT
} from '../../constants/GlobalConstants';
import OtpCodeForm from '../OtpCodeForm/OtpCodeForm';

import './OpenDepositAccount.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const propTypes = {
  user: PropTypes.object
};

const OpenDepositAccount = ({ data: user, history }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({});
  const [depositTerms, setDepositTerms] = useState([]);
  const [otpCodeFormVisible, setOtpCodeFormVisible] = useState(false);
  const emitChangeDebounced = debounce(showDepositResult, 400);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [{ data: accountData }, { data: termsData }] = await fetchAll([
          fetchAccount(),
          getDepositTerms()
        ]);

        const account = accountData
          ? `${accountData.id} - Balance: ${formatMoney(
              accountData.currentBalance
            )} ${accountData.currentUnit}`
          : 'No account';
        form.setFieldsValue({
          account
        });

        setAccount(accountData);
        setDepositTerms(termsData);
      } catch (err) {
        message.error(getErrorMessage(err));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    form.setFieldsValue({ name: user && user.name ? user.name : '' });
  }, [user]);

  const onSelectChange = value => {
    emitChangeDebounced(+value, +form.getFieldValue('amount'));
  };

  const onAmountInputChange = e => {
    const amount = +e.target.value;

    if (amount < MIN_DEPOSIT_AMOUNT) {
      return;
    }

    emitChangeDebounced(+form.getFieldValue('termDeposit'), amount);
  };

  function showDepositResult(termId, amount) {
    const term = find(depositTerms, item => item.id === termId);

    if (term && amount) {
      const { interestRate, period } = term;

      const maturityDate = moment().add(period, 'M').format(DATE_FORMAT);
      const expectedInterest = Math.ceil(
        amount * period * 30 * (+interestRate / 36000)
      );
      const expectedTotalAmount = amount + expectedInterest;

      form.setFieldsValue({
        interestRate,
        maturityDate,
        expectedInterest: formatMoney(expectedInterest),
        expectedTotalAmount: formatMoney(expectedTotalAmount)
      });
    } else {
      form.resetFields([
        'interestRate',
        'maturityDate',
        'expectedInterest',
        'expectedTotalAmount'
      ]);
    }
  }

  const onReset = () => {
    form.resetFields([
      'amount',
      'termDeposit',
      'interestRate',
      'maturityDate',
      'expectedInterest',
      'expectedTotalAmount'
    ]);
  };

  const onFinish = async values => {
    const { termDeposit, amount } = values;
    const term = find(depositTerms, item => item.id === +termDeposit);

    if (!term) {
      return false;
    }

    try {
      setLoading(true);

      const body = { amount: +amount, term: +term.period };
      await registerDepositRequest(body);

      setOtpCodeFormVisible(true);
    } catch (err) {
      message.error(getErrorMessage(err));
    }

    setLoading(false);
  };

  const submitOTPRegisterDeposit = async code => {
    try {
      setLoading(true);

      const body = { otpCode: +code };
      await registerDepositConfirm(body);

      message.success('Deposit account is created');
      //history.push('/');
    } catch (err) {
      message.error(getErrorMessage(err));
    }

    setLoading(false);
  };

  const renderTerms = () => {
    const result = [];
    result.push(
      <Select.Option key={-1} value="">
        Choose term deposit account
      </Select.Option>
    );

    depositTerms.forEach((term, index) => {
      result.push(
        <Select.Option key={index} value={term.id}>
          {`${term.period} Month(s)`}
        </Select.Option>
      );
    });

    return result;
  };

  return (
    <div style={{ maxWidth: '550px' }}>
      <h2 className="page-header">OPEN TERM DEPOSIT ACCOUNT</h2>
      <Spin spinning={loading}>
        <Form
          {...layout}
          form={form}
          name="form"
          className="form"
          onFinish={onFinish}
          initialValues={{ termDeposit: '' }}
        >
          <Form.Item label="Customer name" name="name">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Account" name="account">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: 'Amount is required!' },
              () => ({
                validator(rule, value) {
                  if (+value > +account.currentBalance) {
                    return Promise.reject(
                      `The amount cannot be larger than the current balance`
                    );
                  } else if (!value || +value >= MIN_DEPOSIT_AMOUNT) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    `Minimum amount is ${formatMoney(MIN_DEPOSIT_AMOUNT)} VND`
                  );
                }
              })
            ]}
          >
            <Input
              onChange={onAmountInputChange}
              disabled={otpCodeFormVisible}
            />
          </Form.Item>

          <Form.Item
            label="Term deposit"
            name="termDeposit"
            rules={[{ required: true, message: 'Term deposit is required!' }]}
          >
            <Select onChange={onSelectChange} disabled={otpCodeFormVisible}>
              {renderTerms()}
            </Select>
          </Form.Item>

          <Form.Item label="Interest rate (%/year)" name="interestRate">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Maturity date" name="maturityDate">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Expected interest" name="expectedInterest">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Expected total amount" name="expectedTotalAmount">
            <Input disabled />
          </Form.Item>

          {!otpCodeFormVisible && (
            <Form.Item
              wrapperCol={{
                lg: { offset: 8 }
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={!account || depositTerms.length === 0}
              >
                Open
              </Button>
              <Button
                type="default"
                htmlType="button"
                style={{ marginLeft: '6px' }}
                onClick={onReset}
              >
                Reset
              </Button>
            </Form.Item>
          )}
        </Form>
      </Spin>
      <OtpCodeForm
        visible={otpCodeFormVisible}
        loading={loading}
        submitOTP={submitOTPRegisterDeposit}
      />
    </div>
  );
};

OpenDepositAccount.propTypes = propTypes;

const mapStateToProps = state => {
  return {
    ...getUser(state)
  };
};

export default connect(mapStateToProps)(OpenDepositAccount);
