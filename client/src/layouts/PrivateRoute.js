import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { TOKEN_KEY, LOGIN_URL } from '../constants/GlobalConstants';
import { readCookie } from '../utils/helpers';

export const PrivateRoute = ({
  component: Component,
  layout: Layout,
  isStaffRoute,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        readCookie(TOKEN_KEY) ? (
          <Layout isStaffRoute={isStaffRoute}>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect
            to={isStaffRoute ? `/a2hl-management${LOGIN_URL}` : LOGIN_URL}
          />
        )
      }
    />
  );
};
