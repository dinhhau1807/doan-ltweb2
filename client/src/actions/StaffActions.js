import { fetchApi } from '../utils/api';

const segment = '/staffs';

// customers
export const getCustomers = (params = {}) => {
  return fetchApi(segment + '/customers', 'GET', null, params);
};

export const changeCustomerStatus = body => {
  return fetchApi(segment + '/customers/status', 'POST', body);
};

export const getCustomerDetails = id => {
  return fetchApi(segment + '/customers/' + id, 'GET');
};

export const getCustomerAccounts = id => {
  return fetchApi(segment + `/customers/${id}/accounts`, 'GET');
};

export const getCustomerTransactions = (id, params) => {
  return fetchApi(
    segment + `/customers/${id}/transactions`,
    'GET',
    null,
    params
  );
};

// identities
export const getIdentities = (params = {}) => {
  return fetchApi(segment + '/identities', 'GET', null, params);
};

// identity
export const getIdentity = id => {
  return fetchApi(segment + '/identities/' + id, 'GET');
};

export const approveIdentity = body => {
  return fetchApi(segment + '/customers/approve', 'POST', body);
};

// account transactions
export const getTransactions = (params = {}) => {
  return fetchApi(segment + '/transactionHistory', 'GET', null, params);
};
