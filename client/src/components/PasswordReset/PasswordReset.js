import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, message } from 'antd';

// Actions
import { passwordReset } from '../../actions/UserActions';

// Constants
import { LOGIN_URL } from '../../constants/GlobalConstants';

// Utils
import { getErrorMessage } from '../../utils/helpers';

// Styles
import './PasswordReset.scss';

const propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
};

const PasswordRecovery = ({ match, history }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    try {
      if (match && match.params && match.params.code) {
        setLoading(true);

        const code = match.params.code;
        const body = { verifyCode: code, newPwd: values.password };
        await passwordReset(body);

        message.success('Reset your password successfully!');

        history.push(LOGIN_URL);
      }
    } catch (err) {
      message.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="public-form">
      <div className="public-form__wrap" style={{ width: '400px' }}>
        <h2 className="public-form__header">Password reset</h2>

        <Form name="form" className="form" onFinish={onFinish}>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password is required!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Password confirmation is required!'
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    'Password and password confirmation are not the same!'
                  );
                }
              })
            ]}
          >
            <Input.Password placeholder="Password confirmation" />
          </Form.Item>

          <Form.Item>
            <Button
              loading={loading}
              style={{ width: '100%' }}
              type="primary"
              htmlType="submit"
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

PasswordRecovery.propTypes = propTypes;

export default PasswordRecovery;
