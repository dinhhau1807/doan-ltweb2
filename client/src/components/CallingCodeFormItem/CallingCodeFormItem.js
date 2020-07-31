import React from 'react';
import { Form, Select } from 'antd';
import { countriesCallingCode } from '../../constants/GlobalConstants';

import './CallingCodeFormItem.scss';

const CallingCodeFormItem = () => {
  return (
    <Form.Item name="callingCode">
      <Select>
        {countriesCallingCode.map(country => (
          <Select.Option
            className="flex-center-all"
            key={country.id}
            value={country.callingCode}
          >
            <img className="flag" src={country.flag} alt={country.name} />{' '}
            <span>{country.callingCode}</span>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default CallingCodeFormItem;
