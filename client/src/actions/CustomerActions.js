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

export const getDepositAccounts = () => {
  return fetchApi('/customers/deposit', 'GET');
};

export const getDepositAccount = id => {
  return fetchApi('/customers/deposit/' + id, 'GET');
};

export const withdrawDepositRequest = body => {
  return fetchApi('/customers/withdrawRequest', 'POST', body);
};

export const withdrawDepositConfirm = body => {
  return fetchApi('/customers/withdrawConfirm', 'POST', body);
};

export const getDepositTransactions = (params = {}) => {
  return fetchApi('/customers/depositHistory', 'GET', null, params);
};
