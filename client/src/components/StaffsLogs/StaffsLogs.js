import React, { useState, useEffect } from 'react';
import { Table, Modal, message } from 'antd';
import { merge } from 'lodash';

// Components
import FilterOptions from '../FilterOptions/FilterOptions';
import ComponentHeader from '../ComponentHeader/ComponentHeader';

// Actions
import { getLogs } from '../../actions/AdminActions';

// Constants
import { STAFFS_TABS } from '../../constants/ComponentTabs';
import { FILTER_LOGS } from '../../constants/ColumnFilter';

// Utils
import { getErrorMessage } from '../../utils/helpers';

// Styles
import './StaffsLogs.scss';

const defaultProps = {};

const StaffsLogs = () => {
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
  const staffsTabs = merge({}, STAFFS_TABS);

  // make management page url
  if (isStaffRoute) {
    Object.keys(staffsTabs).forEach(key => {
      staffsTabs[key].to = '/a2hl-management' + staffsTabs[key].to;
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
      // eslint-disable-next-line react/display-name
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
        tabs={staffsTabs}
        selectedTab={staffsTabs.LOGS.to}
        title="Logs Information"
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

StaffsLogs.defaultProps = defaultProps;

export default StaffsLogs;
