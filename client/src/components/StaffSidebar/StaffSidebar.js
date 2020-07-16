import React from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  FileOutlined,
  UserOutlined,
  UserAddOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import { history } from '../../utils/helpers';
import { STAFF_TABS } from '../../constants/GlobalConstants';
import logo from '../../images/logo.png';
import './StaffSidebar.scss';

const { Sider } = Layout;

const rootSegment = '/a2hl-management';

const StaffSidebar = ({ match }) => {
  const selectTab = ({ key }) => {
    let tabUrl = rootSegment;
    switch (key) {
      case STAFF_TABS.IDENTITY:
        tabUrl += STAFF_TABS.IDENTITY;
        break;
      case STAFF_TABS.TRANSACTION:
        tabUrl += STAFF_TABS.TRANSACTION;
        break;
      case STAFF_TABS.STAFF:
        tabUrl += STAFF_TABS.STAFF;
        break;
      default:
        break;
    }

    history.push(tabUrl);
  };

  const path = match.path.replace(rootSegment, '');
  const defaultKey = path === '' ? '/' : path;

  return (
    <Sider width="250" theme="light" breakpoint="lg" collapsedWidth="0">
      <div className="sidebar-logo">
        <img src={logo} alt="logo" />
      </div>
      <Menu
        defaultSelectedKeys={[defaultKey]}
        mode="inline"
        onSelect={selectTab}
      >
        <Menu.Item key={STAFF_TABS.CUSTOMER} icon={<UserOutlined />}>
          Customers
        </Menu.Item>
        <Menu.Item key={STAFF_TABS.IDENTITY} icon={<UserAddOutlined />}>
          Identities
        </Menu.Item>
        <Menu.Item key={STAFF_TABS.TRANSACTION} icon={<FileOutlined />}>
          Transactions
        </Menu.Item>
        <Menu.Item key={STAFF_TABS.STAFF} icon={<ApartmentOutlined />}>
          Employees
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default withRouter(StaffSidebar);
