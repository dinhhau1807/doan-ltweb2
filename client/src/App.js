import React from 'react';
import { Switch, Router } from 'react-router-dom';
import { history } from './utils/helpers';
import { PrivateRoute, PublicRoute } from './layouts';
import { routes } from './routes';

const renderRoutes = (routes = []) => {
  let result = null;
  if (routes.length > 0) {
    result = routes.map(
      ({ isPrivate, isStaffRoute, path, exact, component, layout }, index) =>
        isPrivate ? (
          <PrivateRoute
            key={index}
            path={path}
            exact={exact}
            component={component}
            layout={layout}
            isStaffRoute={isStaffRoute}
          />
        ) : (
          <PublicRoute
            key={index}
            path={path}
            exact={exact}
            component={component}
            layout={layout}
          />
        )
    );
  }
  return <Switch>{result}</Switch>;
};

const App = () => {
  return <Router history={history}>{renderRoutes(routes)}</Router>;
};

export default App;
