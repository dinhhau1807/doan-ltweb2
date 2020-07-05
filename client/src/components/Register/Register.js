import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LOGIN_URL, TOKEN_KEY } from '../../constants/GlobalConstants';
import { createCookie } from '../../utils/helpers';

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

const propTypes = {
  register: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const defaultProps = {};

const Register = ({ register, history }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    try {
      setLoading(true);

      const { email, password, name, DoB, phone, address } = values;

      const body = {
        username: email,
        email,
        password,
        name,
        dateOfBirth: DoB.format('yyyy/MM/DD'),
        phoneNumber: phone,
        address
      };

      const { data } = await register(body);
      createCookie(TOKEN_KEY, data.token);
      history.push('/');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
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
            <a href={LOGIN_URL} style={{ marginLeft: '10px' }}>
              Trở về đăng nhập
            </a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

Register.propTypes = propTypes;
Register.defaultProps = defaultProps;

export default Register;
