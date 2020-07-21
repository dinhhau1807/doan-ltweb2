import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createCookie, getErrorMessage } from '../../utils/helpers';
import { TOKEN_KEY } from '../../constants/GlobalConstants';
import { connect } from 'react-redux';
import { login } from '../../actions/UserActions';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.scss';

const propTypes = {
  login: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const defaultProps = {};

const Login = ({ login, history }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    try {
      setLoading(true);
      const { username, password } = values;
      const { token } = await login('/customers/login', {
        username,
        password
      });
      createCookie(TOKEN_KEY, token);
      history.push('/');
    } catch (err) {
      message.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="public-form">
      <div className="public-form__wrap" style={{ width: '400px' }}>
        <h2 className="public-form__header">A2HL Internet Banking</h2>
        <Form name="form" className="form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Username is required!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password is required!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={loading}
              style={{ width: '100%' }}
              type="primary"
              htmlType="submit"
            >
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <a href="/">Forgot passsword</a>{' '}
            <span>
              or <a href="/register">register here!</a>
            </span>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

Login.propTypes = propTypes;
Login.defaultProps = defaultProps;

const mapStateToProps = () => {
  return {
    login
  };
};

export default connect(mapStateToProps)(Login);
