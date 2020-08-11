import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { message, Table } from 'antd';

// Components
import FilterDate from '../../FilterDate/FilterDate';

// Actions
import { getCustomerTransactions } from '../../../actions/StaffActions';

// Constants
import { DATETIME_FORMAT } from '../../../constants/GlobalConstants';

// Utils
import {
  getErrorMessage,
  formatMoney,
  statusLabel
} from '../../../utils/helpers';

// Styles
import './CustomerTransactions.scss';

const propTypes = {
  customerId: PropTypes.number.isRequired
};

const CustomerTransactions = ({ customerId }) => {
  const [dataTable, setDataTable] = useState([]);
  const [paramsTable, setParamsTable] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  const tableColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      sorter: true,
      render: text => <span>{moment(text).format(DATETIME_FORMAT)}</span>
    },
    {
      title: 'Transaction Number',
      dataIndex: 'id',
      sorter: true
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: true
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: false,
      render: (text, record) => (
        <span>{`${formatMoney(text)} ${record.currencyUnit}`}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: false,
      render: text => {
        const [label, style] = statusLabel('trans', text);
        return <span style={style}>{label}</span>;
      }
    }
  ];

  const onTableChange = (pagination, filters, sorter) => {
    const sortOrder =
      sorter.order === 'descend'
        ? 'desc'
        : sorter.order === 'ascend'
        ? 'asc'
        : undefined;

    fetchDataTable({
      ...paramsTable,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field,
      sortType: sortOrder
    });
  };

  const fetchDataTable = async (params = {}) => {
    const { page, pageSize } = pagination;
    const customParams = {
      page: params.page || page,
      limit: params.pageSize || pageSize,
      sortBy: params.sortBy,
      sortType: params.sortType,

      fromDate: params.fromDate,
      toDate: params.toDate
    };

    try {
      setLoading(true);

      const { items, totalItems } = await getCustomerTransactions(
        customerId,
        customParams
      );
      const paper = { ...pagination };
      paper.total = totalItems;
      paper.current = customParams.page;
      paper.pageSize = customParams.pageSize;

      setLoading(false);
      setPagination(paper);
      setParamsTable(customParams);
      setDataTable(items);
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="table">
        <FilterDate fetchData={fetchDataTable} paramsTable={paramsTable} />
        <Table
          bordered
          size="middle"
          rowKey={record => record.id}
          dataSource={dataTable}
          pagination={pagination}
          columns={tableColumns}
          loading={loading}
          onChange={onTableChange}
        />
      </div>
    </div>
  );
};

CustomerTransactions.propTypes = propTypes;

export default CustomerTransactions;
