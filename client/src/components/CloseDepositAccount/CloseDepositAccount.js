import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Input, Button, Spin, Select, message } from 'antd';
import { find } from 'lodash';
import {
  getDepositAccounts,
  withdrawDepositRequest,
  withdrawDepositConfirm
} from '../../actions/CustomerActions';
import { getErrorMessage, formatMoney } from '../../utils/helpers';
import { DATE_FORMAT, HOUR_FORMAT } from '../../constants/GlobalConstants';
import OtpCodeForm from '../OtpCodeForm/OtpCodeForm';

import './CloseDepositAccount.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const propTypes = {
  history: PropTypes.object
};

const CloseDepositAccount = ({ history }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [otpCodeFormVisible, setOtpCodeFormVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { items } = await getDepositAccounts();
        setAccounts(items);
      } catch (err) {
        message.error(getErrorMessage(err));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (account) {
      const { interestRate, term, currentBalance, createdAt } = account;
      const amount = +currentBalance;

      const maturityDate = moment().add(term, 'M').format(DATE_FORMAT);
      const expectedInterest = Math.ceil(
        amount * term * 30 * (+interestRate / 36000)
      );
      const expectedTotalAmount = amount + expectedInterest;

      form.setFieldsValue({
        interestRate,
        maturityDate,
        createdDate:
          moment(createdAt).utc().format(DATE_FORMAT) +
          ' ' +
          moment(createdAt).utc().format(HOUR_FORMAT),
        expectedInterest: formatMoney(expectedInterest),
        expectedTotalAmount: formatMoney(expectedTotalAmount)
      });
    } else {
      form.resetFields([
        'interestRate',
        'maturityDate',
        'createdDate',
        'expectedInterest',
        'expectedTotalAmount'
      ]);
    }
  }, [account]);

  const renderTerms = () => {
    const result = [];
    result.push(
      <Select.Option key={-1} value="">
        Choose account number
      </Select.Option>
    );

    accounts.forEach((acc, index) => {
      const { id, currentBalance, currentUnit } = acc;
      result.push(
        <Select.Option key={index} value={id}>
          {`${id} - Balance ${formatMoney(currentBalance)} ${currentUnit}`}
        </Select.Option>
      );
    });

    return result;
  };

  const onSelectChange = value => {
    const id = value ? +value : null;
    setAccount(null);
    if (id) {
      const acc = find(accounts, function (item) {
        return item.id === id;
      });

      acc && setAccount(acc);
    }
  };

  const onFinish = async values => {
    try {
      setLoading(true);

      const { accountNumber } = values;
      const body = { idSavingAccount: +accountNumber };
      await withdrawDepositRequest(body);

      setOtpCodeFormVisible(true);
    } catch (err) {
      message.error(getErrorMessage(err));
    }
    setLoading(false);
  };

  const submitOTPWithdrawDeposit = async code => {
    try {
      setLoading(true);

      const body = { otpCode: +code };
      await withdrawDepositConfirm(body);

      message.success('Withdrawal successful');

      setOtpCodeFormVisible(false);
      setLoading(false);

      history.push('/');
    } catch (err) {
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  };

  return (
    <div style={{ width: '550px' }}>
      <h2 className="page-header">CLOSE TERM DEPOSIT ACCOUNT</h2>
      <Spin spinning={loading}>
        <Form
          {...layout}
          form={form}
          name="form"
          className="form"
          onFinish={onFinish}
          initialValues={{ accountNumber: '' }}
        >
          <Form.Item
            label="Account number"
            name="accountNumber"
            rules={[{ required: true, message: 'Account number is required!' }]}
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

          <Form.Item label="Created date" name="createdDate">
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
              <Button type="primary" htmlType="submit" disabled={!account}>
                Close
              </Button>
            </Form.Item>
          )}
        </Form>
      </Spin>
      <OtpCodeForm
        visible={otpCodeFormVisible}
        loading={loading}
        submitOTP={submitOTPWithdrawDeposit}
      />
    </div>
  );
};

CloseDepositAccount.propTypes = propTypes;

export default CloseDepositAccount;
