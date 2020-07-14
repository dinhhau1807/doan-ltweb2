import UserPassword from '../components/UserPassword/UserPassword';
import { connect } from 'react-redux';
import { changePassword } from '../actions/UserActions';

const mapStateToProps = state => {
  return {
    changePassword
  };
};

export default connect(mapStateToProps)(UserPassword);
