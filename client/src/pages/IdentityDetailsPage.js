import IdentityDetails from '../components/IdentityDetails/IdentityDetails';
import { connect } from 'react-redux';
import {
  getIdentity,
  approveIdentity
} from '../actions/StaffIdentitiesActions';

const mapStateToProps = state => {
  return { getIdentity, approveIdentity };
};

export default connect(mapStateToProps)(IdentityDetails);
