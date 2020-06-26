import React from 'react';
import { Switch, Router } from 'react-router-dom';
import { history } from './utils/history';
import { PrivateRoute } from './layouts/PrivateRoute';
import { routes } from './routes';

const renderRoutes = (routes = []) => {
  let result = null;
  if (routes.length > 0) {
    result = routes.map(({ path, exact, component, layout }, index) => (
      <PrivateRoute
        key={index}
        path={path}
        exact={exact}
        component={component}
        layout={layout}
      />
    ));
  }
  return <Switch>{result}</Switch>;
};

const App = () => {
  return <Router history={history}>{renderRoutes(routes)}</Router>;
};

export default App;
