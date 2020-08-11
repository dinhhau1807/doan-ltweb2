import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Spin, message, Select } from 'antd';

// Components
import OtpCodeForm from '../OtpCodeForm/OtpCodeForm';
import ComponentHeader from '../ComponentHeader/ComponentHeader';

// Actions
import { fetchAccount } from '../../actions/CustomerActions';
import {
  externalTransferRequest,
  externalTransferConfirm,
  getBanks
} from '../../actions/TransferActions';

// Constants
import { TRANSFER_TABS } from '../../constants/ComponentTabs';

// Utils
import { getErrorMessage, formatMoney } from '../../utils/helpers';
import { fetchAll } from '../../utils/api';

import './TransferOutsideSystem.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const propTypes = {
  history: PropTypes.object
};

const TransferOutsideSystem = ({ history }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({});
  const [banks, setBanks] = useState([]);
  const [otpCodeFormVisible, setOtpCodeFormVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [{ data: accountData }, { data: banksData }] = await fetchAll([
          fetchAccount(),
          getBanks()
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
        setBanks(banksData);
      } catch (err) {
        message.error(getErrorMessage(err));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const onFinish = async values => {
    if (!account) {
      return false;
    }

    try {
      setLoading(true);

      const { toAccount, amount, description } = values;
      const { id } = account;
      const body = {
        idAccountSource: id,
        idAccountDestination: +toAccount,
        idBankDestination: '1',
        amount: +amount,
        description
      };
      await externalTransferRequest(body);

      setOtpCodeFormVisible(true);
    } catch (err) {
      message.error(getErrorMessage(err));
    }

    setLoading(false);
  };

  const submitOTPRegisterDeposit = async code => {
    try {
      setLoading(true);

      const body = { otpCode: code };
      await externalTransferConfirm(body);

      message.success('Your transaction is created');

      setOtpCodeFormVisible(false);
      setLoading(false);

      history.push('/');
    } catch (err) {
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  };

  const onReset = () => {
    form.resetFields([
      'toAccount',
      'idBankDestination',
      'amount',
      'description'
    ]);
  };

  const renderBanks = () => {
    const result = [];
    result.push(
      <Select.Option key={-1} value="">
        Choose branch
      </Select.Option>
    );

    banks.forEach((bank, index) => {
      result.push(
        <Select.Option key={index} value={bank.id}>
          {bank.name}
        </Select.Option>
      );
    });

    return result;
  };

  return (
    <div className="transfer-outside">
      <ComponentHeader
        tabs={TRANSFER_TABS}
        selectedTab={TRANSFER_TABS.OUTSIDE.to}
        title="Transfer outside system"
      />

      <div className="transfer-outside__form-wrap">
        <Spin spinning={loading}>
          <Form
            {...layout}
            name="form"
            className="form"
            form={form}
            onFinish={onFinish}
            initialValues={{ idBankDestination: '' }}
          >
            <Form.Item label="Account" name="account">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="To account number"
              name="toAccount"
              rules={[
                { required: true, message: 'Account number is required!' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Branch"
              name="idBankDestination"
              rules={[{ required: true, message: 'Branch is required!' }]}
            >
              <Select disabled={otpCodeFormVisible}>{renderBanks()}</Select>
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
                    }
                    return Promise.resolve();
                  }
                })
              ]}
            >
              <Input disabled={otpCodeFormVisible} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Description is required!' }]}
            >
              <Input.TextArea />
            </Form.Item>

            {!otpCodeFormVisible && (
              <Form.Item
                wrapperCol={{
                  lg: { offset: 8 }
                }}
              >
                <Button type="primary" htmlType="submit" disabled={false}>
                  Transfer
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
      </div>

      <OtpCodeForm
        visible={otpCodeFormVisible}
        loading={loading}
        submitOTP={submitOTPRegisterDeposit}
      />
    </div>
  );
};

TransferOutsideSystem.propTypes = propTypes;

export default TransferOutsideSystem;
