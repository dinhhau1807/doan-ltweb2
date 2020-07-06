import React from 'react';
import { Table } from 'antd';
import FilterOptions from '../FilterOptions/FilterOptions';
import { FILTER_CUSTOMERS } from '../../constants/ColumnFilter';

import './CustomersManagement.scss';

const CustomersManagement = () => {
  return (
    <div className="customers-management">
      <h2 className="page-header">THÔNG TIN KHÁCH HÀNG</h2>
      <FilterOptions columnFilter={FILTER_CUSTOMERS} />
      <div className="table">
        <Table size="middle" />
      </div>
    </div>
  );
};

export default CustomersManagement;
