import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUser, logout } from '../../actions/UserActions';
import { Layout, Menu, Dropdown, Spin } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import './Header.scss';

const { Header } = Layout;

const HeaderComponent = ({
  style,
  isStaffRoute,
  user,
  fetchUser,
  logout,
  history
}) => {
  useEffect(() => {
    const type = isStaffRoute ? 'staffs' : 'customers';
    fetchUser(type);
  }, [isStaffRoute]);

  const handleLogout = () => {
    logout();
    history.push(isStaffRoute ? '/a2hl-management/login' : '/login');
  };

  const handleChangePassword = () => {
    history.push(isStaffRoute ? '/a2hl-management/password' : '/password');
  };

  const { loading, data } = user;
  return (
    <Header className="header" style={style}>
      <h1 className="header__left">
        {isStaffRoute ? 'A2HL Management' : 'A2HL Internet Banking'}
      </h1>
      <div className="header__right">
        <Spin spinning={loading}>
          <Dropdown
            overlay={
              <Menu>
                {!isStaffRoute && <Menu.Item>Cập nhật thông tin</Menu.Item>}
                <Menu.Item onClick={handleChangePassword}>
                  Đổi mật khẩu
                </Menu.Item>
                <Menu.Item onClick={handleLogout}>Đăng xuất</Menu.Item>
              </Menu>
            }
          >
            <span style={{ cursor: 'pointer', fontSize: '18px' }}>
              <UserOutlined />
              <span style={{ fontSize: '16px', margin: '0 8px' }}>
                {data ? data.name : null}
              </span>
              <DownOutlined style={{ marginLeft: '4px' }} />
            </span>
          </Dropdown>
        </Spin>
      </div>
    </Header>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default withRouter(
  connect(mapStateToProps, { fetchUser, logout })(HeaderComponent)
);
