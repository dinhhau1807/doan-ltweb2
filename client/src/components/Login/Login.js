import React, { useState } from 'react';
import './Login.scss';

import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = values => {
    setLoading(true);
    console.log('Received values of form: ', values);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="public-form">
      <div className="public-form__wrap" style={{ width: '400px' }}>
        <h2 className="public-form__header">A2HL Internet Banking</h2>
        <Form name="form" className="form" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Email không được bỏ trống!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Mật khẩu không được bỏ trống!' }
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={loading}
              style={{ width: '100%' }}
              type="primary"
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item>
            <a href="/">Quên mật khẩu</a>{' '}
            <span>
              hoặc <a href="/register">đăng kí tại đây!</a>
            </span>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
