import React, { useState } from 'react';
import './Register.scss';

import { Form, Input, Button, DatePicker } from 'antd';

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

const Register = () => {
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
      <div className="public-form__wrap">
        <h2 className="public-form__header">Đăng kí tài khoản</h2>
        <Form
          {...layout}
          name="form"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true }]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Xác nhận mật khẩu không chính xác!');
                }
              })
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="DoB" label="Ngày sinh" rules={[{ required: true }]}>
            <DatePicker format="DD-MM-yyyy" placeholder="" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button loading={loading} type="primary" htmlType="submit">
              Đăng kí
            </Button>
            <a href="/login" style={{ marginLeft: '10px' }}>
              Trở về đăng nhập
            </a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
