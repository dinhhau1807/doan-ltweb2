import { fetchApi } from '../utils/api';

export const getTransactions = (params = {}) => {
  return fetchApi('/staffs/transactionHistory', 'GET', null, params);
};
