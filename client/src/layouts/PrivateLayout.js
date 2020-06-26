import React, { Suspense } from 'react';
import { Spin } from 'antd';

export const PrivateLayout = ({ children }) => {
  return (
    <div>
      <div className="header">
        <a href="/">User</a>
        <a href="/todo">Todo</a>
      </div>
      <Suspense fallback={<Spin></Spin>}>
        <div className="main">{children}</div>
      </Suspense>
    </div>
  );
};
