import CustomersManagement from '../components/CustomersManagement/CustomersManagement';
import { connect } from 'react-redux';
import {
  getCustomers,
  changeCustomerStatus
} from '../actions/StaffCustomersActions';
import { ENTITY_STATUS } from '../constants/GlobalConstants';

const mapStateToProps = state => {
  return {
    getCustomers,
    changeCustomerStatus,
    customerStatus: ENTITY_STATUS
  };
};

export default connect(mapStateToProps)(CustomersManagement);
