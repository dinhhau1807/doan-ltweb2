import CustomersManagement from '../components/CustomersManagement/CustomersManagement';
import { connect } from 'react-redux';
import {
  getCustomers,
  changeCustomerStatus
} from '../actions/StaffCustomersActions';

const mapStateToProps = state => {
  return {
    getCustomers,
    changeCustomerStatus
  };
};

export default connect(mapStateToProps)(CustomersManagement);
