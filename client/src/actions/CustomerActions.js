import { fetchApi } from '../utils/api';

export const fetchAccount = () => {
  return fetchApi('/customers/account', 'GET');
};
