import React, { Suspense } from 'react';
import { Spin, Layout } from 'antd';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { STAFF_TABS, CUSTOMER_TABS } from '../constants/GlobalConstants';

const { Content } = Layout;

export const PrivateLayout = ({ isStaffRoute, children }) => {
  const tabs = isStaffRoute ? STAFF_TABS : CUSTOMER_TABS;

  return (
    <Layout style={{ backgroundColor: '#fff' }}>
      <Sidebar tabs={tabs} />
      <div style={{ width: '100%' }}>
        <Header style={{ background: '#fff' }} isStaffRoute={isStaffRoute} />
        <Content style={{ margin: '16px' }}>
          <Suspense fallback={<Spin className="spinning"></Spin>}>
            <div className="main">{children}</div>
          </Suspense>
        </Content>
      </div>
    </Layout>
  );
};
