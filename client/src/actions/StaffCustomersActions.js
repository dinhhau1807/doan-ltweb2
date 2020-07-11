import { fetchApi } from '../utils/api';

export const getCustomers = (params = {}) => {
  return fetchApi('/staffs/customers', 'GET', null, params);
};

export const changeCustomerStatus = body => {
  return fetchApi('/staffs/customers/status', 'POST', body);
};
