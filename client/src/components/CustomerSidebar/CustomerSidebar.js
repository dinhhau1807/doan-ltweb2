import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  SettingOutlined,
  FileOutlined,
  CreditCardOutlined
} from '@ant-design/icons';

import './CustomerSidebar.scss';
import { history } from '../../utils/helpers';
import { CUSTOMER_TABS } from '../../constants/GlobalConstants';
import logo from '../../images/logo.png';

const { Sider } = Layout;
const { SubMenu } = Menu;

const rootSegment = '';

const CustomerSidebar = () => {
  const [openKeys, setOpenKeys] = useState(['sub-account']);

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

  return (
    <Sider theme="light">
      <div className="sidebar-logo">
        <img src={logo} />
      </div>
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        defaultSelectedKeys={[CUSTOMER_TABS.ACCOUNT]}
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

export default CustomerSidebar;
