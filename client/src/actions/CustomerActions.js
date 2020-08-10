import { fetchApi } from '../utils/api';

const apiSegment = '/customers';

export const fetchAccount = () => {
  return fetchApi(apiSegment + '/account', 'GET');
};

export const getAccountTransactions = (params = {}) => {
  return fetchApi(apiSegment + '/transactionHistory', 'GET', null, params);
};

export const getDepositTerms = () => {
  return fetchApi(apiSegment + '/depositTerms', 'GET');
};

export const registerDepositRequest = body => {
  return fetchApi(apiSegment + '/depositRegisterRequest', 'POST', body);
};

export const registerDepositConfirm = body => {
  return fetchApi(apiSegment + '/depositRegisterConfirm', 'POST', body);
};

export const getDepositAccounts = () => {
  return fetchApi(apiSegment + '/deposit', 'GET');
};

export const getDepositAccount = id => {
  return fetchApi(apiSegment + '/deposit/' + id, 'GET');
};

export const withdrawDepositRequest = body => {
  return fetchApi(apiSegment + '/withdrawRequest', 'POST', body);
};

export const withdrawDepositConfirm = body => {
  return fetchApi(apiSegment + '/withdrawConfirm', 'POST', body);
};

export const getDepositTransactions = (params = {}) => {
  return fetchApi(apiSegment + '/depositHistory', 'GET', null, params);
};
