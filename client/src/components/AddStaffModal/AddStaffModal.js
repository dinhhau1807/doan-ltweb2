import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Input, message } from 'antd';
import {
  PlusOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined
} from '@ant-design/icons';

// Utils
import { getErrorMessage } from '../../utils/helpers';

// Styles
import './AddStaffModal.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label} is required!'
};

const propTypes = {
  width: PropTypes.string,
  createStaff: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  paramsTable: PropTypes.object
};

const defaultProps = {
  paramsTable: {}
};

const AddStaffModal = ({ createStaff, fetchData, paramsTable, width }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = e => {
    if (!loading) {
      setVisible(false);
    }
  };

  const onFinish = async values => {
    try {
      setLoading(true);

      const { username, name, password } = values;
      const body = { username, password, name };

      await createStaff(body);

      //reset modal
      setVisible(false);
      setLoading(false);
      form.resetFields();

      //reload table
      fetchData(paramsTable);
    } catch (err) {
      message.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div style={{ width }}>
      <Button style={{ width: '100%' }} type="primary" onClick={showModal}>
        <PlusOutlined /> Create
      </Button>
      <Modal
        title="Create new account"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" loading={loading} onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            form="addStaffForm"
            htmlType="submit"
            type="primary"
            loading={loading}
          >
            Create
          </Button>
        ]}
      >
        <Form
          {...layout}
          form={form}
          id="addStaffForm"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Fullname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

AddStaffModal.propTypes = propTypes;
AddStaffModal.defaultProps = defaultProps;

export default AddStaffModal;
