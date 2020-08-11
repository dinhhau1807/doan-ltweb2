import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions, Table } from 'antd';
import moment from 'moment';

// Constants
import {
  DATETIME_FORMAT,
  DATE_FORMAT
} from '../../../constants/GlobalConstants';

// Utils
import { statusLabel, formatMoney } from '../../../utils/helpers';

// Styles
import './CustomerInfo.scss';

const propTypes = {
  details: PropTypes.object.isRequired
};

const CustomerInfo = ({ details, accounts }) => {
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
        return <span>{moment(text).format(DATETIME_FORMAT)}</span>;
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
              {moment(createdAt).add(term, 'M').format(DATETIME_FORMAT)}
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
        const [label, style] = statusLabel('person', text);
        return <span style={style}>{label}</span>;
      }
    }
  ];

  const {
    id,
    name,
    username,
    dateOfBirth,
    email,
    phoneNumber,
    address,
    createdAt,
    status
  } = details;
  const [label, style] = statusLabel('person', status);

  return (
    <div className="customer-info">
      <div className="customer-info__info">
        <Descriptions bordered>
          <Descriptions.Item label="Customer ID">{id}</Descriptions.Item>
          <Descriptions.Item label="Fullname">{name}</Descriptions.Item>
          <Descriptions.Item label="Username">{username}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {moment(dateOfBirth).format(DATE_FORMAT)}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Address">{address}</Descriptions.Item>
          <Descriptions.Item label="Created Date">
            {moment(createdAt).format(DATETIME_FORMAT)}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <span style={style}>{label}</span>
          </Descriptions.Item>
        </Descriptions>
      </div>

      <div className="table">
        <Table
          bordered
          size="middle"
          rowKey={record => record.id}
          dataSource={accounts}
          columns={tableColumns}
          pagination={{ page: 1, pageSize: 100 }}
        />
      </div>
    </div>
  );
};

CustomerInfo.propTypes = propTypes;

export default CustomerInfo;
