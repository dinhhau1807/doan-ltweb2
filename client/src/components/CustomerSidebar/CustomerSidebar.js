import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  SettingOutlined,
  FileOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { history } from '../../utils/helpers';
import { CUSTOMER_TABS } from '../../constants/GlobalConstants';
import logo from '../../images/logo.png';
import './CustomerSidebar.scss';

const { Sider } = Layout;
const { SubMenu } = Menu;

const rootSegment = '';

const CustomerSidebar = ({ match }) => {
  const [openKeys, setOpenKeys] = useState([
    'sub-account',
    'sub-transaction',
    'sub-savings',
    'sub-utils'
  ]);

  const onOpenChange = openKeys => {
    setOpenKeys(openKeys);
  };

  const selectTab = ({ key }) => {
    let tabUrl = rootSegment;
    switch (key) {
      case CUSTOMER_TABS.ACCOUNT_HISTORY:
        tabUrl += CUSTOMER_TABS.ACCOUNT_HISTORY;
        break;
      case CUSTOMER_TABS.TRANSACTION:
        tabUrl += CUSTOMER_TABS.TRANSACTION;
        break;
      case CUSTOMER_TABS.TRANSACTION_EXTERNAL:
        tabUrl += CUSTOMER_TABS.TRANSACTION_EXTERNAL;
        break;
      case CUSTOMER_TABS.SAVINGS_REQUEST:
        tabUrl += CUSTOMER_TABS.DEPOSIT_REQUEST;
        break;
      case CUSTOMER_TABS.SAVINGS_WITHDRAW:
        tabUrl += CUSTOMER_TABS.DEPOSIT_WITHDRAW;
        break;
      case CUSTOMER_TABS.SAVINGS_TRANSACTION_HISTORY:
        tabUrl += CUSTOMER_TABS.DEPOSIT_TRANSACTION_HISTORY;
        break;
      case CUSTOMER_TABS.UTILS_UPDATE:
        tabUrl += CUSTOMER_TABS.UTILS_UPDATE;
        break;
      case CUSTOMER_TABS.UTILS_PASSWORD:
        tabUrl += CUSTOMER_TABS.UTILS_PASSWORD;
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
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        defaultSelectedKeys={[defaultKey]}
        onSelect={selectTab}
      >
        <SubMenu
          key="sub-account"
          title={
            <span>
              <DesktopOutlined />
              <span>Account</span>
            </span>
          }
        >
          <Menu.Item key={CUSTOMER_TABS.ACCOUNT}>Account infomation</Menu.Item>
          <Menu.Item key={CUSTOMER_TABS.ACCOUNT_HISTORY}>
            History transactions
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub-transaction" icon={<FileOutlined />} title="Transfer">
          <Menu.Item key={CUSTOMER_TABS.TRANSACTION}>
            Transfer inside system
          </Menu.Item>
          <Menu.Item key={CUSTOMER_TABS.TRANSACTION_EXTERNAL}>
            Transfer outside system
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub-savings"
          icon={<CreditCardOutlined />}
          title="Deposit"
        >
          <Menu.Item key={CUSTOMER_TABS.SAVINGS_REQUEST}>
            Open new deposit account
          </Menu.Item>
          <Menu.Item key={CUSTOMER_TABS.SAVINGS_WITHDRAW}>
            Close term deposit account
          </Menu.Item>
          <Menu.Item key={CUSTOMER_TABS.SAVINGS_TRANSACTION_HISTORY}>
            Deposit transactions
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub-utils"
          icon={<SettingOutlined />}
          title="Other utilities"
        >
          <Menu.Item key={CUSTOMER_TABS.UTILS_UPDATE}>
            Update information
          </Menu.Item>
          <Menu.Item key={CUSTOMER_TABS.UTILS_PASSWORD}>
            Change password
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default withRouter(CustomerSidebar);
