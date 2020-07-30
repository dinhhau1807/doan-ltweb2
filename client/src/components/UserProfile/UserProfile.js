import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Row, Col, message, DatePicker } from 'antd';
import { getErrorMessage } from '../../utils/helpers';
import { DATE_FORMAT } from '../../constants/GlobalConstants';
import { connect } from 'react-redux';
import { updateProfile } from '../../actions/UserActions';
import { getUser } from '../../selectors/UserSelectors';
import {
  CUSTOMER_PROFILE_INPUTS,
  STAFF_PROFILE_INPUTS
} from '../../constants/ColumnFilter';

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
  const route = window.location.href.includes('/a2hl-management')
    ? 'staffs'
    : 'customers';

  const onFinish = async values => {
    try {
      await updateProfile(route, { ...values });
      message.success('Update information successful');
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  if (!data) {
    return null;
  }

  const inputs =
    route === 'staffs' ? STAFF_PROFILE_INPUTS : CUSTOMER_PROFILE_INPUTS;
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
            initialValues={{ ...data }}
          >
            {inputs.map(input => {
              switch (input.type) {
                case 'input':
                  return (
                    <Form.Item
                      key={input.name}
                      name={input.name}
                      label={input.label}
                    >
                      <Input />
                    </Form.Item>
                  );
                case 'datepicker':
                  return (
                    <Form.Item
                      key={input.name}
                      name={input.name}
                      label={input.label}
                    >
                      <DatePicker format={DATE_FORMAT} />
                    </Form.Item>
                  );
                default:
                  return null;
              }
            })}
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
