import React, { useState } from 'react';
import moment from 'moment';
import { message, Table } from 'antd';

// Components
import FilterDate from '../FilterDate/FilterDate';
import ComponentHeader from '../ComponentHeader/ComponentHeader';

// Actions
import { getDepositTransactions } from '../../actions/CustomerActions';

// Constants
import { DATETIME_FORMAT } from '../../constants/GlobalConstants';
import { DEPOSIT_TABS } from '../../constants/ComponentTabs';

// Utils
import { getErrorMessage, formatMoney, statusLabel } from '../../utils/helpers';

// Styles
import './DepositTransactions.scss';

const DepositTransactions = () => {
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

      const { items, totalItems } = await getDepositTransactions(customParams);
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
      <ComponentHeader
        tabs={DEPOSIT_TABS}
        selectedTab={DEPOSIT_TABS.HISTORY.to}
        title="Deposit history"
      />

      <FilterDate fetchData={fetchDataTable} paramsTable={paramsTable} />

      <div className="table">
        <Table
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

export default DepositTransactions;
