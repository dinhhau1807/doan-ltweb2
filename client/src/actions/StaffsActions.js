import { fetchApi } from '../utils/api';

export const getStaffs = (params = {}) => {
  return fetchApi('/admin/staffs', 'GET', null, params);
};

export const changeStaffStatus = body => {
  return fetchApi('/admin/staffs/status', 'POST', body);
};

export const createStaff = body => {
  return fetchApi('/admin/staffs', 'POST', body);
};
