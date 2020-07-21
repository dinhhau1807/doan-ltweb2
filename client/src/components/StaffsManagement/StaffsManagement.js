import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Dropdown, message, Row, Col } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import FilterOptions from '../FilterOptions/FilterOptions';
import { FILTER_STAFFS } from '../../constants/ColumnFilter';
import { getErrorMessage } from '../../utils/helpers';
import EditStatusDropdown from '../EditStatusDropdown/EditStatusDropdown';
import AddStaffModal from '../AddStaffModal/AddStaffModal';
import { connect } from 'react-redux';
import {
  getStaffs,
  changeStaffStatus,
  createStaff
} from '../../actions/StaffsActions';
import { ENTITY_STATUS } from '../../constants/GlobalConstants';

import './StaffsManagement.scss';

const propTypes = {
  getStaffs: PropTypes.func.isRequired,
  changeStaffStatus: PropTypes.func.isRequired,
  history: PropTypes.object,
  staffStatus: PropTypes.object,
  createStaff: PropTypes.func.isRequired
};

const defaultProps = {};

const StaffsManagement = ({
  getStaffs,
  changeStaffStatus,
  history,
  staffStatus,
  createStaff
}) => {
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
      title: 'Fullnamee',
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
        const style = { fontWeight: '700', cursor: 'pointer' };
        const status = staffStatus[text];
        let label = 'Other';
        if (status) {
          label = status.label;
          style.color = status.color;
        }

        return (
          <Dropdown
            overlay={
              <EditStatusDropdown
                statusList={Object.keys(staffStatus)
                  .filter(key => key !== text)
                  .map(key => ({ key, label: staffStatus[key].label }))}
                item={record}
                onChangeStatus={onChangeStatus}
                disabled={loading}
              />
            }
          >
            <span style={style}>
              {label} <DownOutlined />
            </span>
          </Dropdown>
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
      email: params.email,
      name: params.name,
      phone: params.phone,
      address: params.address
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
      <h2 className="page-header">EMPLOYEES INFORMATION</h2>
      <Row gutter={8}>
        <Col span={20}>
          <FilterOptions
            columnFilter={FILTER_STAFFS}
            fetchData={fetchDataTable}
            paramsTable={paramsTable}
          />
        </Col>
        <Col span={4}>
          <AddStaffModal
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

const mapStateToProps = () => {
  return {
    getStaffs,
    changeStaffStatus,
    staffStatus: ENTITY_STATUS,
    createStaff
  };
};

export default connect(mapStateToProps)(StaffsManagement);
