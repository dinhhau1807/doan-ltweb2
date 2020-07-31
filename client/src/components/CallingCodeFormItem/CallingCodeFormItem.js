import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, message } from 'antd';
import { getCountries } from '../../actions/UserActions';

import './CallingCodeFormItem.scss';

const propTypes = {
  setState: PropTypes.func
};

const CallingCodeFormItem = ({ setState }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setState(true);

      //get countries calling code
      try {
        const data = await getCountries('https://restcountries.eu/rest/v2/all');
        const result = data
          .filter(
            coun =>
              coun.callingCodes && coun.callingCodes.length > 0 && !!coun.flag
          )
          .map((coun, index) => ({
            id: index + 1,
            name: coun.name,
            callingCode: '+' + coun.callingCodes[0],
            flag: coun.flag
          }));
        setCountries(result);
      } catch (err) {
        setCountries([
          {
            id: 0,
            name: 'Viet Nam',
            callingCode: '+84',
            flag: 'https://restcountries.eu/data/vnm.svg'
          }
        ]);
        message.error('Something went wrong');
        console.log(err);
      }

      setState(false);
    };

    fetchData();
  }, []);

  return (
    <Form.Item name="callingCode">
      <Select>
        {countries.map(country => (
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

CallingCodeFormItem.propTypes = propTypes;

export default CallingCodeFormItem;
