import React from 'react';
import { Table } from 'antd';
import FilterOptions from '../FilterOptions/FilterOptions';
import { FILTER_STAFFS } from '../../constants/ColumnFilter';

import './StaffsManagement.scss';

const StaffsManagement = () => {
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
      title: 'Tình trạng',
      dataIndex: 'status',
      sorter: false
    }
  ];

  const handleEditItem = staff => () => {
    window.open('/edit/' + staff.id, '_blank');
  };

  return (
    <div className="staffs-management">
      <h2 className="page-header">THÔNG TIN NHÂN VIÊN</h2>
      <FilterOptions columnFilter={FILTER_STAFFS} />
      <div className="table">
        <Table size="middle" columns={tableColumns} loading={true} />
      </div>
    </div>
  );
};

export default StaffsManagement;
