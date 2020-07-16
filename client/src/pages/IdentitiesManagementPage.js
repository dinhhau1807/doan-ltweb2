import IdentitiesManagement from '../components/IdentitiesManagement/IdentitiesManagement';
import { connect } from 'react-redux';
import { getIdentities } from '../actions/StaffIdentitiesActions';

const mapStateToProps = state => {
  return {
    getIdentities
  };
};

export default connect(mapStateToProps)(IdentitiesManagement);
