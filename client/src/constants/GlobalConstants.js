export const TOKEN_KEY = 'token';
export const LOGIN_URL = '/login';

export const STAFF_TABS = {
  CUSTOMER: '/',
  IDENTITY: '/identity',
  TRANSACTION: '/transaction',
  STAFF: '/staffs'
};

export const CUSTOMER_TABS = {
  ACCOUNT: '/',
  ACCOUNT_HISTORY: '/history',
  TRANSACTION: '/transaction',
  TRANSACTION_EXTERNAL: '/ext-transaction',
  SAVINGS_REQUEST: '/savings-request',
  SAVINGS_WITHDRAW: '/savings-withdraw',
  SAVINGS_TRANSACTION_HISTORY: '/savings-history',
  UTILS_UPDATE: '/update-infomation',
  UTILS_PASSWORD: '/change-password'
};

export const ENTITY_STATUS = {
  inactive: { label: 'Inactive', color: '#fbc02d' },
  active: { label: 'Active', color: '#64dd17' },
  blocked: { label: 'Blocked', color: '#9e9e9e' },
  deleted: { label: 'Deleted', color: '#d50000' }
};
