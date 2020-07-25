import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import { getUser } from '../../selectors/UserSelectors';
import { fetchAccount } from '../../actions/CustomerActions';
import { formatMoney } from '../../utils/helpers';

import './OpenDepositAccount.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const propTypes = {
  data: PropTypes.object
};

const OpenDepositAccount = ({ data: user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({});
  const [depositTerms, setDepositTerms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data } = await fetchAccount();

      const account = data
        ? `${data.id} - Balance: ${formatMoney(data.currentBalance)} ${
            data.currentUnit
          }`
        : 'No account';
      form.setFieldsValue({
        account
      });

      setAccount(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    form.setFieldsValue({ name: user && user.name ? user.name : '' });
  }, [user]);

  const onFinish = () => {};

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
            rules={[{ required: true, message: 'Amount is required!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Open account" name="openAccount">
            <Input />
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
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    ...getUser(state)
  };
};

export default connect(mapStateToProps)(OpenDepositAccount);
