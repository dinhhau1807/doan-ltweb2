import Login from '../components/Login/Login';
import { connect } from 'react-redux';
import { login } from '../actions/UserActions';

const mapStateToProps = state => {
  return {
    login
  };
};

export default connect(mapStateToProps)(Login);
