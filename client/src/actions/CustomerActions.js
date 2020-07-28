import { fetchApi } from '../utils/api';

export const fetchAccount = () => {
  return fetchApi('/customers/account', 'GET');
};

export const getAccountTransactions = (params = {}) => {
  return fetchApi('/customers/transactionHistory', 'GET', null, params);
};

export const getDepositTerms = () => {
  return fetchApi('/customers/depositTerms', 'GET');
};

export const registerDepositRequest = body => {
  return fetchApi('/customers/depositRegisterRequest', 'POST', body);
};

export const registerDepositConfirm = body => {
  return fetchApi('/customers/depositRegisterConfirm', 'POST', body);
};
