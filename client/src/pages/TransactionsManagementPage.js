import TransactionManangement from '../components/TransactionsManagement/TransactionsManagement';
import { connect } from 'react-redux';
import { getTransactions } from '../actions/StaffTransactionsActions';
import { TRANSACTION_STATUS } from '../constants/GlobalConstants';

const mapStateToProps = state => {
  return { getTransactions, transactionStatus: TRANSACTION_STATUS };
};

export default connect(mapStateToProps)(TransactionManangement);
