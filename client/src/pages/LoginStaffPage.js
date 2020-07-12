import LoginStaff from '../components/LoginStaff/LoginStaff';

import { connect } from 'react-redux';
import { login } from '../actions/UserActions';

const mapStateToProps = state => {
  return {
    login
  };
};

export default connect(mapStateToProps)(LoginStaff);
