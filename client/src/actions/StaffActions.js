import { fetchApi } from '../utils/api';

// customers
export const getCustomers = (params = {}) => {
  return fetchApi('/staffs/customers', 'GET', null, params);
};

export const changeCustomerStatus = body => {
  return fetchApi('/staffs/customers/status', 'POST', body);
};

export const getCustomerDetails = id => {
  return fetchApi('/staffs/customers/' + id, 'GET');
};

export const getCustomerAccounts = id => {
  return fetchApi(`/staffs/customers/${id}/accounts`, 'GET');
};

export const getCustomerTransactions = (id, params) => {
  return fetchApi(`/staffs/customers/${id}/transactions`, 'GET', null, params);
};

// identities
export const getIdentities = (params = {}) => {
  return fetchApi('/staffs/identities', 'GET', null, params);
};

// identity
export const getIdentity = id => {
  return fetchApi('/staffs/identities/' + id, 'GET');
};

export const approveIdentity = body => {
  return fetchApi('/staffs/customers/approve', 'POST', body);
};

// account transactions
export const getTransactions = (params = {}) => {
  return fetchApi('/staffs/transactionHistory', 'GET', null, params);
};
