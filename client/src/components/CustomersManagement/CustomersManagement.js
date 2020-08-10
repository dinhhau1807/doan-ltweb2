import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, message, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// Components
import FilterOptions from '../FilterOptions/FilterOptions';
import EditStatusDropdown from '../EditStatusDropdown/EditStatusDropdown';

// Actions
import { getCustomers, changeCustomerStatus } from '../../actions/StaffActions';

// Constants
import { ENTITY_STATUS } from '../../constants/GlobalConstants';
import { FILTER_CUSTOMERS } from '../../constants/ColumnFilter';

// Utils
import { getErrorMessage, statusLabel } from '../../utils/helpers';

// Styles
import './CustomersManagement.scss';

const propTypes = {
  history: PropTypes.object
};

const defaultProps = {};

const CustomersManagement = ({ history }) => {
  const [dataTable, setDataTable] = useState([]);
  const [paramsTable, setParamsTable] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDataTable();
  }, []);

  const tableColumns = [
    {
      title: 'Customer ID',
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
      title: 'Email',
      dataIndex: 'email',
      sorter: true
    },
    {
      title: 'Birthday',
      dataIndex: 'dateOfBirth',
      sorter: false
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      sorter: true
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: false,
      render: (text, record) => {
        const [label, style] = statusLabel('person', text);

        return (
          <Dropdown
            overlay={
              <EditStatusDropdown
                statusList={Object.keys(ENTITY_STATUS)
                  .filter(key => key !== text)
                  .map(key => ({ key, label: ENTITY_STATUS[key].label }))}
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

  const onChangeStatus = async (id, status) => {
    const body = { idCustomer: +id, status };
    try {
      setLoading(true);

      await changeCustomerStatus(body);

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

  const handleViewCustomerDetails = customer => () => {
    history.push('a2hl-management/customers/' + customer.id);
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

      const { items, totalItems } = await getCustomers(customParams);

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
    <div className="customers-management">
      <h2 className="page-header">CUSTOMERS INFORMATION</h2>
      <FilterOptions
        columnFilter={FILTER_CUSTOMERS}
        fetchData={fetchDataTable}
        paramsTable={paramsTable}
      />
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

CustomersManagement.propTypes = propTypes;
CustomersManagement.defaultProps = defaultProps;

export default CustomersManagement;
