import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Menu, Spin, message } from 'antd';

// Components
import ComponentHeader from '../ComponentHeader/ComponentHeader';
import CustomerInfo from './CustomerInfo/CustomerInfo';
import CustomerTransactions from './CustomerTransactions/CustomerTransactions';

// Actions
import {
  getCustomerDetails,
  getCustomerAccounts
} from '../../actions/StaffActions';

// Utils
import { fetchAll } from '../../utils/api';
import { getErrorMessage } from '../../utils/helpers';

// Styles
import './CustomerDetails.scss';

const propTypes = {
  match: PropTypes.object
};

const CustomerDetails = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState('details');
  const [details, setDetails] = useState({});
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchData = async id => {
      try {
        setLoading(true);

        const [{ data: detailsData }, { data: accountsData }] = await fetchAll([
          getCustomerDetails(id),
          getCustomerAccounts(id)
        ]);

        setDetails(detailsData);
        setAccounts(accountsData);
        setLoading(false);
      } catch (err) {
        message.error(getErrorMessage(err));
        setLoading(false);
      }
    };

    if (current === 'details' && match && match.params && match.params.id) {
      fetchData(match.params.id);
    }
  }, [current]);

  const handleClick = e => {
    setCurrent(e.key);
  };

  const { id } = details;
  const title =
    current === 'details' ? 'Customer info' : 'Customer transactions';
  const page =
    current === 'details' ? (
      <CustomerInfo details={details} accounts={accounts} />
    ) : (
      <CustomerTransactions customerId={id} />
    );
  return (
    <div className="customer-details">
      <ComponentHeader title="Customer Details" />

      <div className="customer-details__header">
        <span className="customer-details__title">{title}</span>

        <Menu
          className="customer-details__menu"
          onClick={handleClick}
          selectedKeys={[current]}
          mode="horizontal"
        >
          <Menu.Item key="details">Details</Menu.Item>
          <Menu.Item key="transactions">Transactions</Menu.Item>
        </Menu>
      </div>

      <div className="customer-details__page">
        <Spin spinning={loading}>{page}</Spin>
      </div>
    </div>
  );
};

CustomerDetails.propTypes = propTypes;

export default CustomerDetails;
