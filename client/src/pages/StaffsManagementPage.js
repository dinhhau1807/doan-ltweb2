import StaffsManagement from '../components/StaffsManagement/StaffsManagement';
import { connect } from 'react-redux';
import {
  getStaffs,
  changeStaffStatus,
  createStaff
} from '../actions/StaffsActions';
import { ENTITY_STATUS } from '../constants/GlobalConstants';

const mapStateToProps = state => {
  return {
    getStaffs,
    changeStaffStatus,
    staffStatus: ENTITY_STATUS,
    createStaff
  };
};

export default connect(mapStateToProps)(StaffsManagement);
