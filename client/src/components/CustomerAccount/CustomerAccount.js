import React, { useState, useEffect } from 'react';
import { message, Table } from 'antd';
import { fetchAccount } from '../../actions/CustomerActions';
import { getErrorMessage } from '../../utils/helpers';

import './CustomerAccount.scss';

const CustomerAccount = () => {
  const [account, setAccount] = useState({});
  const [loading, setLoading] = useState(false);

  const tableColumns = [
    {
      title: 'Account',
      dataIndex: 'id'
    },
    {
      title: 'Balance',
      dataIndex: 'currentBalance'
    },
    {
      title: 'Currency Unit',
      dataIndex: 'currentUnit'
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await fetchAccount();
        setAccount(data);
      } catch (err) {
        message.error(getErrorMessage(err));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="page-header">ACCOUNT INFORMATION</h2>
      <div className="table">
        <Table
          size="middle"
          rowKey={record => record.id}
          dataSource={[account]}
          columns={tableColumns}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CustomerAccount;
