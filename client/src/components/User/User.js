import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './User.scss';

const propTypes = {
  user: PropTypes.object,
  fetchUser: PropTypes.func.isRequired
};

const defaultProps = {};

const User = ({ user, fetchUser }) => {
  useEffect(() => {
    //fetchUser();
  }, [fetchUser]);

  const { loading, data } = user;
  return <div>{loading ? 'Loading...' : JSON.stringify(data)}</div>;
};

User.propTypes = propTypes;
User.defaultProps = defaultProps;

export default User;
