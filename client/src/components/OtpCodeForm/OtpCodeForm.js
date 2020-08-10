import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

// Styles
import './OtpCodeForm.scss';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  submitOTP: PropTypes.func.isRequired
};

const OtpCodeForm = ({ visible, loading, submitOTP }) => {
  if (!visible) {
    return null;
  }

  const onFinish = values => {
    submitOTP(values.code);
  };

  return (
    <Form
      name="formOTP"
      style={{ margin: '10px 0' }}
      className="form"
      onFinish={onFinish}
    >
      <Form.Item
        label="OTP Code"
        name="code"
        rules={[{ required: true, message: 'OTP Code is required' }]}
      >
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        Accept
      </Button>
    </Form>
  );
};

OtpCodeForm.propTypes = propTypes;

export default OtpCodeForm;
