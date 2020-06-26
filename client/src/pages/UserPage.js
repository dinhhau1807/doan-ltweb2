import { connect } from 'react-redux';
import { fetchUser } from '../actions/UserActions';
import User from '../components/User';

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, { fetchUser })(User);
