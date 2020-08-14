import { fetchApi } from '../utils/api';

const apiSegment = '/admin';

export const getStaffs = (params = {}) => {
  return fetchApi(apiSegment + '/staffs', 'GET', null, params);
};

export const changeStaffStatus = body => {
  return fetchApi(apiSegment + '/staffs/status', 'POST', body);
};

export const createStaff = body => {
  return fetchApi(apiSegment + '/staffs', 'POST', body);
};

// logs
export const getLogs = (params = {}) => {
  return fetchApi(apiSegment + '/logs', 'GET', null, params);
};
