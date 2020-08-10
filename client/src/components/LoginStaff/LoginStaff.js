import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// Actions
import { login } from '../../actions/UserActions';

// Constants
import { TOKEN_KEY } from '../../constants/GlobalConstants';

// Utils
import { createCookie, getErrorMessage } from '../../utils/helpers';

// Styles
import './LoginStaff.scss';

const propTypes = {
  history: PropTypes.object.isRequired
};

const defaultProps = {};

const LoginStaff = ({ history }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    try {
      setLoading(true);
      const { username, password } = values;
      const { token } = await login('/staffs/login', {
        username,
        password
      });
      createCookie(TOKEN_KEY, token);
      history.push('/a2hl-management');
    } catch (err) {
      message.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="public-form">
      <div className="public-form__wrap" style={{ width: '400px' }}>
        <h2 className="public-form__header">A2HL Management</h2>
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
        </Form>
      </div>
    </div>
  );
};

LoginStaff.propTypes = propTypes;
LoginStaff.defaultProps = defaultProps;

export default LoginStaff;
