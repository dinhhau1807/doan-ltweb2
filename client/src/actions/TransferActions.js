import { fetchApi } from '../utils/api';

export const internalTransferRequest = body => {
  return fetchApi('/customers/internalTransferRequest', 'POST', body);
};

export const internalTransferConfirm = body => {
  return fetchApi('/customers/internalTransferConfirm', 'POST', body);
};

export const externalTransferRequest = body => {
  return fetchApi('/customers/externalTransferRequest', 'POST', body);
};

export const externalTransferConfirm = body => {
  return fetchApi('/customers/externalTransferRequest', 'POST', body);
};

export const getBanks = () => {
  return fetchApi('/customers/banks', 'GET');
};
