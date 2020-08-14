import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, message } from 'antd';
import { merge } from 'lodash';

// Components
import FilterOptions from '../FilterOptions/FilterOptions';
import ComponentHeader from '../ComponentHeader/ComponentHeader';

// Actions
import { getLogs } from '../../actions/AdminActions';

// Constants
import { UTILS_TABS } from '../../constants/ComponentTabs';
import { FILTER_LOGS } from '../../constants/ColumnFilter';

// Utils
import { getErrorMessage } from '../../utils/helpers';

// Styles
import './UserLogs.scss';

// const layout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 }
// };

// const validateMessages = {
//   required: '${label} is required!'
// };

const defaultProps = {};

const UserLogs = () => {
  const [dataTable, setDataTable] = useState([]);
  const [paramsTable, setParamsTable] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 50 });
  const [loading, setLoading] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [dataDetails, setDataDetails] = useState({});

  useEffect(() => {
    fetchDataTable();
  }, []);

  const isStaffRoute = window.location.href.includes('/a2hl-management');
  const utilsTabs = merge({}, UTILS_TABS);

  // make management page url
  if (isStaffRoute) {
    Object.keys(utilsTabs).forEach(key => {
      utilsTabs[key].to = '/a2hl-management' + utilsTabs[key].to;
    });
  }

  const tableColumns = [
    {
      title: 'Log Id',
      dataIndex: 'id',
      sorter: false
    },
    {
      title: 'Staff Id',
      dataIndex: 'staffId',
      sorter: false
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: false
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: false
    },
    {
      title: 'Action',
      dataIndex: '',
      render: record => (
        <span
          className="table__id"
          onClick={() => handleOpenViewDetails(JSON.parse(record.data))}
        >
          View
        </span>
      )
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
      staffId: params.staffId
    };

    try {
      setLoading(true);

      const { items, totalItems } = await getLogs(customParams);

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

  const handleOpenViewDetails = data => {
    setDataDetails(data);
    setViewDetails(true);
  };

  const handleCloseViewDetails = () => {
    setViewDetails(false);
  };

  return (
    <div className="password">
      <ComponentHeader
        tabs={utilsTabs}
        selectedTab={utilsTabs.LOGS.to}
        title="View Logs"
      />

      <FilterOptions
        columnFilter={FILTER_LOGS}
        fetchData={fetchDataTable}
        paramsTable={paramsTable}
      />

      <Modal
        title="Log Details"
        visible={viewDetails}
        centered
        onOk={handleCloseViewDetails}
        onCancel={handleCloseViewDetails}
      >
        {Object.keys(dataDetails).map(key => (
          <p key={key}>
            <b>{key}:</b> {dataDetails[key]}
          </p>
        ))}
      </Modal>

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
    </div>
  );
};

UserLogs.defaultProps = defaultProps;

export default UserLogs;
