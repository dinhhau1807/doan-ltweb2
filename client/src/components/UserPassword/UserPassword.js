import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { merge } from 'lodash';

// Components
import ComponentHeader from '../ComponentHeader/ComponentHeader';

// Actions
import { changePassword } from '../../actions/UserActions';

// Constants
import { UTILS_TABS } from '../../constants/ComponentTabs';

// Utils
import { getErrorMessage } from '../../utils/helpers';

// Styles
import './UserPassword.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label} is required!'
};

const UserPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isStaffRoute = window.location.href.includes('/a2hl-management');
  const utilsTabs = merge({}, UTILS_TABS);

  // make management page url
  if (isStaffRoute) {
    Object.keys(utilsTabs).forEach(key => {
      utilsTabs[key].to = '/a2hl-management' + utilsTabs[key].to;
    });
  }

  const onFinish = async values => {
    try {
      setLoading(true);

      const { oldPassword, newPassword } = values;
      const route = window.location.href.includes('/a2hl-management')
        ? 'staffs'
        : 'customers';
      const data = await changePassword(route, {
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
    <div className="password">
      <ComponentHeader
        tabs={utilsTabs}
        selectedTab={utilsTabs.PASSWORD.to}
        title="Change password"
      />
      <div className="password__form-wrap">
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
      </div>
    </div>
  );
};

export default UserPassword;
