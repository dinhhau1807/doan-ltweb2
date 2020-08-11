import { fetchApi } from '../utils/api';

const segment = '/customers';

export const internalTransferRequest = body => {
  return fetchApi(segment + '/internalTransferRequest', 'POST', body);
};

export const internalTransferConfirm = body => {
  return fetchApi(segment + '/internalTransferConfirm', 'POST', body);
};

export const externalTransferRequest = body => {
  return fetchApi(segment + '/externalTransferRequest', 'POST', body);
};

export const externalTransferConfirm = body => {
  return fetchApi(segment + '/externalTransferRequest', 'POST', body);
};

export const getBanks = () => {
  return fetchApi(segment + '/banks', 'GET');
};
