import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { getErrorMessage } from '../../utils/helpers';

import './UserPassword.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label} is required!'
};

const propTypes = {
  changePassword: PropTypes.func.isRequired
};

const defaultProps = {};

const UserPassword = ({ changePassword }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    try {
      setLoading(true);

      const { oldPassword, newPassword } = values;
      const data = await changePassword('customers', {
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
    <div>
      <h2 className="page-header">CHANGE PASSWORD</h2>
      <Row>
        <Col xs={24} sm={24} md={20} lg={12}>
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
        </Col>
      </Row>
    </div>
  );
};

UserPassword.propTypes = propTypes;
UserPassword.defaultProps = defaultProps;

export default UserPassword;
