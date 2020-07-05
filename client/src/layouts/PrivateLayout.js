import React, { Suspense } from 'react';
import { Spin, Layout } from 'antd';
import CustomerSidebar from '../components/CustomerSidebar/CustomerSidebar';
import StaffSidebar from '../components/StaffSidebar/StaffSidebar';

const { Header, Content, Footer } = Layout;

export const PrivateLayout = ({ isStaffRoute, children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isStaffRoute ? <StaffSidebar /> : <CustomerSidebar />}
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '16px' }}>
          <Suspense fallback={<Spin className="spinning"></Spin>}>
            <div className="main">{children}</div>
          </Suspense>
        </Content>
        <Footer style={{ textAlign: 'center' }}>A2HL Internet Banking</Footer>
      </Layout>
    </Layout>
  );
};
