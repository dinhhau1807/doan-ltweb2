import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { message, Table } from 'antd';
import {
  fetchAccount,
  getDepositAccounts
} from '../../actions/CustomerActions';
import { getErrorMessage, formatMoney } from '../../utils/helpers';
import {
  ENTITY_STATUS,
  DATE_FORMAT,
  HOUR_FORMAT
} from '../../constants/GlobalConstants';
import { fetchAll } from '../../utils/api';

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
        return (
          <span>
            {moment(text).format(DATE_FORMAT) +
              ' ' +
              moment(text).format(HOUR_FORMAT)}
          </span>
        );
      }
    },
    {
      title: 'Interest rate',
      dataIndex: 'interestRate',
      render: text => <span>{+text > 0 ? text : ''}</span>
    },
    {
      title: 'Maturity Date',
      dataIndex: 'term',
      render: (text, record) => {
        if (+text > 0) {
          const { term, createdAt } = record;
          return (
            <span>
              {moment(createdAt).add(term).format(DATE_FORMAT) +
                ' ' +
                moment(createdAt).add(term).format(HOUR_FORMAT)}
            </span>
          );
        }
        return '';
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
        const [
          { data: dataAccount },
          { items: dataDeposits }
        ] = await fetchAll([fetchAccount(), getDepositAccounts()]);
        setAccount([dataAccount, ...dataDeposits]);
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
          pagination={{ page: 1, pageSize: 100 }}
        />
      </div>
    </div>
  );
};

export default CustomerAccount;
