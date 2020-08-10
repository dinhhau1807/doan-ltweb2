import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';

// Actions
import { passwordRecovery } from '../../actions/UserActions';

// Utils
import { getErrorMessage } from '../../utils/helpers';

// Styles
import './PasswordRecovery.scss';

const PasswordRecovery = () => {
  const [loading, setLoading] = useState(false);
  const [buttonnEnabled, setButtonEnabled] = useState(true);

  const onFinish = async values => {
    try {
      if (buttonnEnabled) {
        setLoading(true);

        const body = { email: values.email };
        await passwordRecovery(body);

        setLoading(false);
        setButtonEnabled(false);
      }
    } catch (err) {
      message.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="public-form">
      <div className="public-form__wrap" style={{ width: '400px' }}>
        <h2 className="public-form__header">Password recovery</h2>
        <Form name="form" className="form" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Email is required!' }]}
          >
            <Input type="email" placeholder="Input your email" />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={!buttonnEnabled}
              loading={loading}
              style={{ width: '100%' }}
              type="primary"
              htmlType="submit"
            >
              {buttonnEnabled ? 'Send' : 'Please check your email!'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PasswordRecovery;
