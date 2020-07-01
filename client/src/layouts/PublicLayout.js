import React, { Suspense } from 'react';
import { Spin } from 'antd';

export const PublicLayout = ({ children }) => {
  return (
    <Suspense fallback={<Spin className="spinning"></Spin>}>
      <div className="main">{children}</div>
    </Suspense>
  );
};
