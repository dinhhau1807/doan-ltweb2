import { fetchApi } from '../utils/api';

export const getIdentities = (params = {}) => {
  return fetchApi('/staffs/identities', 'GET', null, params);
};

export const getIdentity = id => {
  return fetchApi('/staffs/identities/' + id, 'GET');
};

export const approveIdentity = body => {
  return fetchApi('/staffs/customers/approve', 'POST', body);
};
