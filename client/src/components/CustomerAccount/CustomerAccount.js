import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { message, Table } from 'antd';
import { fetchAccount } from '../../actions/CustomerActions';
import { getErrorMessage } from '../../utils/helpers';
import {
  ENTITY_STATUS,
  DATE_FORMAT,
  HOUR_FORMAT
} from '../../constants/GlobalConstants';
import { formatMoney } from '../../utils/helpers';

import './CustomerAccount.scss';

const CustomerAccount = () => {
  const [account, setAccount] = useState([]);
  const [loading, setLoading] = useState(false);

  const tableColumns = [
    {
      title: 'Account',
      dataIndex: 'id'
    },
    {
      title: 'Balance',
      dataIndex: 'currentBalance',
      render: text => <span>{formatMoney(text)}</span>
    },
    {
      title: 'Currency Unit',
      dataIndex: 'currentUnit'
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      render: text => {
        const datetime =
          moment(text).utc().format(DATE_FORMAT) +
          ' ' +
          moment(text).utc().format(HOUR_FORMAT);
        return <span>{datetime}</span>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: text => {
        const style = { fontWeight: '700' };
        const status = ENTITY_STATUS[text];
        let label = 'Other';
        if (status) {
          label = status.label;
          style.color = status.color;
        }

        return <span style={style}>{label}</span>;
      }
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await fetchAccount();
        setAccount([data]);
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
          dataSource={account}
          columns={tableColumns}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CustomerAccount;
