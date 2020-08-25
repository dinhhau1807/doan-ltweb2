import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, DatePicker, Button } from 'antd';

// Constants
import { DATE_FORMAT } from '../../constants/GlobalConstants';

// Styles
import './FilterDate.scss';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

const initialValues = () => {
  const today = new Date();
  const fromDate = moment(today).subtract(1, 'M');
  const toDate = moment(today);

  return { fromDate, toDate };
};

const propTypes = {
  fetchData: PropTypes.func.isRequired,
  paramsTable: PropTypes.object
};

const FilterDate = ({ fetchData, paramsTable }) => {
  const onFinish = values => {
    const fromDate = values.fromDate.format(DATE_FORMAT);
    const toDate = values.toDate.format(DATE_FORMAT);
    const params = { ...paramsTable, page: 1, fromDate, toDate };

    fetchData(params);
  };

  return (
    <div className="filter-date">
      <Form
        {...layout}
        name="form"
        className="form"
        initialValues={initialValues()}
        onFinish={onFinish}
      >
        <Form.Item
          label="From Date"
          name="fromDate"
          rules={[{ required: true, message: 'From date is required!' }]}
        >
          <DatePicker format={DATE_FORMAT} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="To Date"
          name="toDate"
          rules={[{ required: true, message: 'To date is required!' }]}
        >
          <DatePicker format={DATE_FORMAT} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            lg: { offset: 6 },
            sm: { offset: 6 }
          }}
        >
          <Button type="primary" htmlType="submit">
            View
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

FilterDate.propTypes = propTypes;

export default FilterDate;
