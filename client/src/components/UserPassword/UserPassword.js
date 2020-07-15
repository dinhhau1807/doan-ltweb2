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
  required: '${label} không được bỏ trống!',
  types: {
    // eslint-disable-next-line no-template-curly-in-string
    email: '${label} không đúng định dạng!'
  }
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
      await changePassword('customers', {
        oldPassword,
        newPassword
      });

      message.success('Change password successfully');

      form.resetFields();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="page-header">ĐỔI MẬT KHẨU</h2>
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
              label="Mật khẩu cũ"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmNewPassword"
              label="Xác nhận mật khẩu mới"
              dependencies={['newPassword']}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Xác nhận mật khẩu không chính xác!');
                  }
                })
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button loading={loading} type="primary" htmlType="submit">
                Đổi mật khẩu
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
