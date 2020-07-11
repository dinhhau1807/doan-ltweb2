import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, message, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import FilterOptions from '../FilterOptions/FilterOptions';
import { FILTER_CUSTOMERS } from '../../constants/ColumnFilter';
import { CUSTOMER_STATUS } from '../../constants/GlobalConstants';
import { getErrorMessage } from '../../utils/helpers';
import EditStatusDropdown from '../EditStatusDropdown/EditStatusDropdown';

import './CustomersManagement.scss';

const propTypes = {
  getCustomers: PropTypes.func.isRequired,
  changeCustomerStatus: PropTypes.func.isRequired
};

const defaultProps = {};

const CustomersManagement = ({
  getCustomers,
  changeCustomerStatus,
  history
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
      title: 'Mã KH',
      dataIndex: 'id',
      sorter: false,
      render: (text, record) => (
        <span className="table__id" onClick={handleViewCustomerDetails(record)}>
          {text}
        </span>
      )
    },
    {
      title: 'Họ tên',
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
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      sorter: false
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phoneNumber',
      sorter: true
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: true
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      sorter: false,
      render: (text, record) => {
        const style = { fontWeight: '700', cursor: 'pointer' };
        const status = CUSTOMER_STATUS[text];
        let label = 'Other';
        if (status) {
          label = status.label;
          style.color = status.color;
        }

        return (
          <Dropdown
            overlay={
              <EditStatusDropdown
                statusList={Object.keys(CUSTOMER_STATUS)
                  .filter(key => key !== text)
                  .map(key => ({ key, label: CUSTOMER_STATUS[key].label }))}
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
      <h2 className="page-header">THÔNG TIN KHÁCH HÀNG</h2>
      <FilterOptions columnFilter={FILTER_CUSTOMERS} />
      <div className="table">
        <Table
          size="middle"
          rowKey={record => record.id}
          dataSource={dataTable}
          pagination={pagination}
          columns={tableColumns}
          loading={loading}
        />
      </div>
    </div>
  );
};

CustomersManagement.propTypes = propTypes;
CustomersManagement.defaultProps = defaultProps;

export default CustomersManagement;
