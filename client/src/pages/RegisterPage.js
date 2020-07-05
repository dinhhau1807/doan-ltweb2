import Register from '../components/Register/Register';
import { connect } from 'react-redux';
import { register } from '../actions/UserActions';

const mapStateToProps = state => {
  return {
    register
  };
};

export default connect(mapStateToProps)(Register);
