import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Dropdown, message, Row, Col } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// Components
import FilterOptions from '../FilterOptions/FilterOptions';
import AddStaffModal from '../AddStaffModal/AddStaffModal';
import EditStatusDropdown from '../EditStatusDropdown/EditStatusDropdown';
import ComponentHeader from '../ComponentHeader/ComponentHeader';

// Actions
import {
  getStaffs,
  changeStaffStatus,
  createStaff
} from '../../actions/AdminActions';

// Constants
import { ENTITY_STATUS } from '../../constants/GlobalConstants';
import { FILTER_STAFFS } from '../../constants/ColumnFilter';

// Utils
import { getErrorMessage, statusLabel } from '../../utils/helpers';

// Styles
import './StaffsManagement.scss';

const propTypes = {
  history: PropTypes.object
};

const defaultProps = {};

const StaffsManagement = ({ history }) => {
  const [dataTable, setDataTable] = useState([]);
  const [paramsTable, setParamsTable] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDataTable();
  }, []);

  const tableColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: false,
      render: (text, record) => (
        <span className="table__id" onClick={handleViewCustomerDetails(record)}>
          {text}
        </span>
      )
    },
    {
      title: 'Fullname',
      dataIndex: 'name',
      sorter: true
    },
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: false,
      render: (text, record) => {
        const [label, style] = statusLabel('person', text);

        return (
          <EditStatusDropdown
            statusList={Object.keys(ENTITY_STATUS)
              .filter(key => key !== text)
              .map(key => ({ key, label: ENTITY_STATUS[key].label }))}
            item={record}
            onChangeStatus={onChangeStatus}
            disabled={loading}
          >
            <span style={style}>
              {label} <DownOutlined />
            </span>
          </EditStatusDropdown>
        );
      }
    }
  ];

  const handleViewCustomerDetails = staff => () => {
    history.push('a2hl-management/staffs/' + staff.id);
  };

  const onChangeStatus = async (id, status) => {
    const body = { idStaff: +id, status };
    try {
      setLoading(true);

      await changeStaffStatus(body);

      fetchDataTable(paramsTable);
    } catch (err) {
      message.error(getErrorMessage(err));
      setLoading(false);
    }
  };

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

      username: params.username,
      name: params.name
    };

    try {
      setLoading(true);

      const { items, totalItems } = await getStaffs(customParams);

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
    <div className="staffs-management">
      <ComponentHeader title="Employees information" />
      <Row gutter={[8, 8]}>
        <Col xl={20} lg={20} md={20} sm={24} xs={24}>
          <FilterOptions
            columnFilter={FILTER_STAFFS}
            fetchData={fetchDataTable}
            paramsTable={paramsTable}
          />
        </Col>
        <Col xl={4} lg={4} md={4} sm={24} xs={24}>
          <AddStaffModal
            width="100%"
            createStaff={createStaff}
            fetchData={fetchDataTable}
            paramsTable={paramsTable}
          />
        </Col>
      </Row>
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

StaffsManagement.propTypes = propTypes;
StaffsManagement.defaultProps = defaultProps;

export default StaffsManagement;
