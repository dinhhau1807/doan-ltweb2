import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { getErrorMessage } from '../../utils/helpers';
import { changePassword } from '../../actions/UserActions';

import './UserPassword.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label} is required!'
};

const UserPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async values => {
    try {
      setLoading(true);

      const { oldPassword, newPassword } = values;
      const route = window.location.href.includes('/a2hl-management')
        ? 'staffs'
        : 'customers';
      const data = await changePassword(route, {
        oldPassword,
        newPassword
      });

      message.success(data.message);

      form.resetFields();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 className="page-header">CHANGE PASSWORD</h2>
      <Form
        {...layout}
        name="form"
        form={form}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name="oldPassword"
          label="Your old password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Your new password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          label="New password confirmation"
          dependencies={['newPassword']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  'New password and password confirmation are not the same!'
                );
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button loading={loading} type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserPassword;
