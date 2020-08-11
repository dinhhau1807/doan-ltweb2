import React, { useState } from 'react';
import moment from 'moment';
import { message, Table } from 'antd';

// Components
import FilterDate from '../FilterDate/FilterDate';
import ComponentHeader from '../ComponentHeader/ComponentHeader';

// Actions
import { getAccountTransactions } from '../../actions/CustomerActions';

// Constants
import { DATETIME_FORMAT } from '../../constants/GlobalConstants';
import { ACCOUNT_TABS } from '../../constants/ComponentTabs';

// Utils
import { getErrorMessage, formatMoney, statusLabel } from '../../utils/helpers';

// Styles
import './AccountTransactions.scss';

const AccountTransactions = () => {
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
      title: 'Bank Name',
      dataIndex: 'bankDestinationName',
      sorter: false
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

      const { items, totalItems } = await getAccountTransactions(customParams);
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
    <React.Fragment>
      <ComponentHeader
        tabs={ACCOUNT_TABS}
        selectedTab={ACCOUNT_TABS.HISTORY.to}
        title="Account history"
      />

      <FilterDate fetchData={fetchDataTable} paramsTable={paramsTable} />

      <div className="table">
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
    </React.Fragment>
  );
};

export default AccountTransactions;
