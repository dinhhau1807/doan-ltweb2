import UserProfile from '../components//UserProfile/UserProfile';
import { connect } from 'react-redux';
import { updateProfile } from '../actions/UserActions';

const mapStateToProps = state => {
  return { ...state.user };
};

export default connect(mapStateToProps, { updateProfile })(UserProfile);
