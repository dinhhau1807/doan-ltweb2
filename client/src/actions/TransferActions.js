import { fetchApi } from '../utils/api';

export const internalTransferRequest = body => {
  return fetchApi('/customers/internalTransferRequest', 'POST', body);
};

export const internalTransferConfirm = body => {
  return fetchApi('/customers/internalTransferConfirm', 'POST', body);
};
