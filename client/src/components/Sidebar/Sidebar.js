import React from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';

// Utils
import { history } from '../../utils/helpers';

// Styles
import logo from '../../images/logo.png';
import './Sidebar.scss';

const { Sider } = Layout;

const StaffSidebar = ({ isStaffRoute, tabs, match }) => {
  const rootSegment = isStaffRoute ? '/a2hl-management' : '';
  const path = match.path.replace(rootSegment, '');
  const defaultKey = path === '' ? '/' : path;

  const selectTab = ({ key }) => {
    history.push(rootSegment + key);
  };

  return (
    <Sider width="300" theme="light" breakpoint="lg" collapsedWidth="0">
      <div className="sidebar-logo">
        <img src={logo} alt="logo" />
      </div>
      <Menu
        defaultSelectedKeys={[defaultKey]}
        mode="inline"
        onSelect={selectTab}
      >
        {Object.keys(tabs).map(tab => (
          <Menu.Item key={tabs[tab].to} icon={tabs[tab].icon}>
            {tabs[tab].label}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default withRouter(StaffSidebar);
