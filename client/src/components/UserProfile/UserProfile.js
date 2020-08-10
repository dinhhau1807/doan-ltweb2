import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Row, Col, DatePicker, Spin } from 'antd';
import { find, merge } from 'lodash';
import { connect } from 'react-redux';

// Components
import CallingCodeFormItem from '../CallingCodeFormItem/CallingCodeFormItem';
import ComponentHeader from '../ComponentHeader/ComponentHeader';

// Actions
import { updateProfile } from '../../actions/UserActions';

// Constants
import {
  DATE_FORMAT,
  countriesCallingCode
} from '../../constants/GlobalConstants';
import {
  CUSTOMER_PROFILE_INPUTS,
  STAFF_PROFILE_INPUTS
} from '../../constants/ColumnFilter';
import { UTILS_TABS } from '../../constants/ComponentTabs';

// Selectors
import { getUser } from '../../selectors/UserSelectors';

// Styles
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
  const [form] = Form.useForm();

  const isStaffRoute = window.location.href.includes('/a2hl-management');
  const route = isStaffRoute ? 'staffs' : 'customers';
  const inputs = isStaffRoute ? STAFF_PROFILE_INPUTS : CUSTOMER_PROFILE_INPUTS;
  const utilsTabs = merge({}, UTILS_TABS);

  // make management page url
  if (isStaffRoute) {
    Object.keys(utilsTabs).forEach(key => {
      utilsTabs[key].to = '/a2hl-management' + utilsTabs[key].to;
    });
  }

  const getPhoneNumber = (data, countriesCallingCode) => {
    if (data && data.phoneNumber) {
      const { phoneNumber } = data;
      const country = find(countriesCallingCode, function (item) {
        return phoneNumber.includes(item.callingCode);
      });
      let code = '';
      if (country) {
        code = phoneNumber.replace(country.callingCode, '');
      }
      return [country.callingCode, code];
    }
    return ['+84', ''];
  };

  const phoneNumerMemoized = useMemo(
    () => getPhoneNumber(data, countriesCallingCode),
    [data, countriesCallingCode]
  );

  useEffect(() => {
    if (data !== null) {
      form.setFieldsValue({
        ...data,
        callingCode: phoneNumerMemoized[0],
        phoneNumber: phoneNumerMemoized[1]
      });
    }
  }, [data]);

  const onFinish = async values => {
    const { callingCode, phoneNumber } = values;
    updateProfile(route, {
      ...values,
      phoneNumber: callingCode + phoneNumber
    });
  };

  return (
    <div className="profile">
      <ComponentHeader
        tabs={utilsTabs}
        selectedTab={utilsTabs.PROFILE.to}
        title="Update profile"
      />
      <div className="profile__form-wrap">
        <Spin spinning={loading}>
          <Form
            {...layout}
            name="form"
            form={form}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            {inputs.map(input => {
              switch (input.type) {
                case 'input':
                  return (
                    <Form.Item
                      key={input.name}
                      name={input.name}
                      label={input.label}
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  );
                case 'phonecallingcode':
                  return (
                    <Form.Item
                      key={input.name}
                      label="Phone"
                      rules={[{ required: true }]}
                      style={{ marginBottom: '0' }}
                    >
                      <Row gutter={4}>
                        <Col span={8}>
                          <CallingCodeFormItem />
                        </Col>
                        <Col span={16}>
                          <Form.Item
                            name={input.name}
                            rules={[
                              { required: true, message: 'Phone is required' }
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  );
                case 'datepicker':
                  return (
                    <Form.Item
                      key={input.name}
                      name={input.name}
                      label={input.label}
                      rules={[{ required: true }]}
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
        </Spin>
      </div>
    </div>
  );
};

UserProfile.propTypes = propTypes;
UserProfile.defaultProps = defaultProps;

const mapStateToProps = state => {
  return { ...getUser(state) };
};

export default connect(mapStateToProps, { updateProfile })(UserProfile);
