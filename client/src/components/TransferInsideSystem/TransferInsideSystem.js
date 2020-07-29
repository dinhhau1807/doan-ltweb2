import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Spin, message } from 'antd';
import { fetchAccount } from '../../actions/CustomerActions';
import {
  internalTransferRequest,
  internalTransferConfirm
} from '../../actions/TransferActions';
import { getErrorMessage, formatMoney } from '../../utils/helpers';
import OtpCodeForm from '../OtpCodeForm/OtpCodeForm';

import './TransferInsideSystem.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const propTypes = {
  history: PropTypes.object
};

const TransferInsideSystem = ({ history }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({});
  const [otpCodeFormVisible, setOtpCodeFormVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const { data: accountData } = await fetchAccount();

        const account = accountData
          ? `${accountData.id} - Balance: ${formatMoney(
              accountData.currentBalance
            )} ${accountData.currentUnit}`
          : 'No account';
        form.setFieldsValue({
          account
        });

        setAccount(accountData);
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
        amount: +amount,
        description
      };
      await internalTransferRequest(body);

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
      await internalTransferConfirm(body);

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
    form.resetFields(['toAccount', 'amount', 'description']);
  };

  return (
    <div style={{ maxWidth: '550px' }}>
      <h2 className="page-header">TRANSFER INSIDE SYSTEM</h2>
      <Spin spinning={loading}>
        <Form
          {...layout}
          name="form"
          className="form"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item label="Account" name="account">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="To account number"
            name="toAccount"
            rules={[{ required: true, message: 'Account number is required!' }]}
          >
            <Input />
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
      <OtpCodeForm
        visible={otpCodeFormVisible}
        loading={loading}
        submitOTP={submitOTPRegisterDeposit}
      />
    </div>
  );
};

TransferInsideSystem.propTypes = propTypes;

export default TransferInsideSystem;
