import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Row, Col, message, DatePicker } from 'antd';
import { getErrorMessage } from '../../utils/helpers';
import moment from 'moment';
import { DATE_FORMAT } from '../../constants/GlobalConstants';
import { connect } from 'react-redux';
import { updateProfile } from '../../actions/UserActions';
import { getUser } from '../../selectors/UserSelectors';

import './UserProfile.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label} is required!'
};

const propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  updateProfile: PropTypes.func.isRequired
};

const defaultProps = {};

const UserProfile = ({ loading, data, updateProfile }) => {
  const onFinish = async values => {
    try {
      const { name, phoneNumber, dateOfBirth, address } = values;
      const body = {
        name,
        phoneNumber,
        dateOfBirth: dateOfBirth.format(DATE_FORMAT),
        address
      };

      const data = await updateProfile('customers', body);

      message.success(data.message);
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  if (!data) {
    return null;
  }

  const { name, phoneNumber, address, dateOfBirth } = data;

  return (
    <div>
      <h2 className="page-header">Update information</h2>
      <Row>
        <Col xs={24} sm={24} md={20} lg={12}>
          <Form
            {...layout}
            name="form"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={{
              name,
              phoneNumber,
              address,
              dateOfBirth: moment(dateOfBirth)
            }}
          >
            <Form.Item
              name="name"
              label="Fullname"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label="Birthday"
              rules={[{ required: true }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button loading={loading} type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

UserProfile.propTypes = propTypes;
UserProfile.defaultProps = defaultProps;

const mapStateToProps = state => {
  return { ...getUser(state) };
};

export default connect(mapStateToProps, { updateProfile })(UserProfile);
