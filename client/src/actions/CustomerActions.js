import { fetchApi } from '../utils/api';

export const fetchAccount = () => {
  return fetchApi('/customers/account', 'GET');
};

export const getAccountTransactions = (params = {}) => {
  return fetchApi('/customers/transactionHistory', 'GET', null, params);
};
