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
        tabUrl += CUSTOMER_TABS.SAVINGS_REQUEST;
        break;
      case CUSTOMER_TABS.SAVINGS_WITHDRAW:
        tabUrl += CUSTOMER_TABS.SAVINGS_WITHDRAW;
        break;
      case CUSTOMER_TABS.SAVINGS_TRANSACTION_HISTORY:
        tabUrl += CUSTOMER_TABS.SAVINGS_TRANSACTION_HISTORY;
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
    <Sider theme="light" breakpoint="lg" collapsedWidth="0">
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
              <span>Tài khoản</span>
            </span>
          }
        >
          <Menu.Item key={CUSTOMER_TABS.ACCOUNT}>Thông tin tài khoản</Menu.Item>
          <Menu.Item key={CUSTOMER_TABS.ACCOUNT_HISTORY}>
            Lịch sử giao dịch
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub-transaction"
          icon={<FileOutlined />}
          title="Chuyển tiền"
        >
          <Menu.Item key={CUSTOMER_TABS.TRANSACTION}>Trong ngân hàng</Menu.Item>
          <Menu.Item key={CUSTOMER_TABS.TRANSACTION_EXTERNAL}>
            Liên ngân hàng
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub-savings"
          icon={<CreditCardOutlined />}
          title="Tiền gửi"
        >
          <Menu.Item key={CUSTOMER_TABS.SAVINGS_REQUEST}>
            Mở tài khoản
          </Menu.Item>
          <Menu.Item key={CUSTOMER_TABS.SAVINGS_WITHDRAW}>
            Rút tiền gửi
          </Menu.Item>
          <Menu.Item key={CUSTOMER_TABS.SAVINGS_TRANSACTION_HISTORY}>
            Lịch sử giao dịch
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub-utils"
          icon={<SettingOutlined />}
          title="Tiện ích khác"
        >
          <Menu.Item key={CUSTOMER_TABS.UTILS_UPDATE}>
            Cập nhật thông tin
          </Menu.Item>
          <Menu.Item key={CUSTOMER_TABS.UTILS_PASSWORD}>Đổi mật khẩu</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default withRouter(CustomerSidebar);
