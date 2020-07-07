import React from 'react';
import { Table } from 'antd';
import FilterOptions from '../FilterOptions/FilterOptions';
import { FILTER_CUSTOMERS } from '../../constants/ColumnFilter';

import './CustomersManagement.scss';

const CustomersManagement = () => {
  const tableColumns = [
    {
      title: 'Mã KH',
      dataIndex: 'id',
      sorter: false,
      render: (text, record) => (
        <span onClick={handleEditItem(record)}>{text}</span>
      )
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      sorter: true
    },
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      sorter: false
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phoneNumber',
      sorter: true
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: true
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      sorter: false
    }
  ];

  const handleEditItem = customer => () => {
    window.open('/edit/' + customer.id, '_blank');
  };

  return (
    <div className="customers-management">
      <h2 className="page-header">THÔNG TIN KHÁCH HÀNG</h2>
      <FilterOptions columnFilter={FILTER_CUSTOMERS} />
      <div className="table">
        <Table size="middle" columns={tableColumns} loading={true} />
      </div>
    </div>
  );
};

export default CustomersManagement;
