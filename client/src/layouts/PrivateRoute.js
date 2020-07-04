import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { TOKEN_KEY, LOGIN_URL } from '../constants/GlobalConstants';
import { readCookie } from '../utils/helpers';

export const PrivateRoute = ({
  component: Component,
  layout: Layout,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        readCookie(TOKEN_KEY) ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect to={LOGIN_URL} />
        )
      }
    />
  );
};
