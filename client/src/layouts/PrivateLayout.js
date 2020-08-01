import React, { Suspense } from 'react';
import { Spin, Layout } from 'antd';
import CustomerSidebar from '../components/CustomerSidebar/CustomerSidebar';
import StaffSidebar from '../components/StaffSidebar/StaffSidebar';
import Header from '../components/Header/Header';

const { Content, Footer } = Layout;

export const PrivateLayout = ({ isStaffRoute, children }) => {
  return (
    <Layout>
      {isStaffRoute ? <StaffSidebar /> : <CustomerSidebar />}
      <div style={{ width: '100%' }}>
        <Header style={{ background: '#fff' }} isStaffRoute={isStaffRoute} />
        <Content style={{ margin: '16px' }}>
          <Suspense fallback={<Spin className="spinning"></Spin>}>
            <div className="main">{children}</div>
          </Suspense>
        </Content>
        <Footer
          style={{
            textAlign: 'center'
          }}
        >
          A2HL Internet Banking
        </Footer>
      </div>
    </Layout>
  );
};
