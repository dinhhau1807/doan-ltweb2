import StaffsManagement from '../components/StaffsManagement/StaffsManagement';
import { connect } from 'react-redux';
import { getStaffs, changeStaffStatus } from '../actions/StaffsActions';
import { ENTITY_STATUS } from '../constants/GlobalConstants';

const mapStateToProps = state => {
  return {
    getStaffs,
    changeStaffStatus,
    staffStatus: ENTITY_STATUS
  };
};

export default connect(mapStateToProps)(StaffsManagement);
