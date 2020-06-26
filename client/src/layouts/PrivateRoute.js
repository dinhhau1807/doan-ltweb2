import React from 'react';
import { Route } from 'react-router-dom';

export const PrivateRoute = ({
  component: Component,
  layout: Layout,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};
