import React from 'react';
import { Redirect } from 'react-router-dom';

const withAuthenticated = (InnerComponent, redirectTo = 'login') => {
  return ({ user, isStaffRoute, ...props }) => {
    const segment = isStaffRoute ? '/a2hl-management/' : '/';

    const { loading, data } = user;
    if (!loading && !data) {
      return <Redirect to={segment + redirectTo} />;
    }

    return (
      <InnerComponent
        {...props}
        user={user}
        isStaffRoute={isStaffRoute}
        segment={segment}
      />
    );
  };
};

export default withAuthenticated;
