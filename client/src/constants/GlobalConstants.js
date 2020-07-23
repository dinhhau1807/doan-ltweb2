export const TOKEN_KEY = 'token';
export const LOGIN_URL = '/login';

export const STAFF_TABS = {
  CUSTOMER: '/',
  IDENTITY: '/identities',
  TRANSACTION: '/transaction',
  STAFF: '/staffs'
};

export const CUSTOMER_TABS = {
  ACCOUNT: '/',
  ACCOUNT_HISTORY: '/history',
  TRANSACTION: '/transaction',
  TRANSACTION_EXTERNAL: '/ext-transaction',
  DEPOSIT_REQUEST: '/deposit-request',
  DEPOSIT_WITHDRAW: '/deposit-withdraw',
  DEPOSIT_TRANSACTION_HISTORY: '/deposit-history',
  UTILS_UPDATE: '/profile',
  UTILS_PASSWORD: '/password'
};

export const ENTITY_STATUS = {
  inactive: { label: 'Inactive', color: '#fbc02d' },
  active: { label: 'Active', color: '#64dd17' },
  blocked: { label: 'Blocked', color: '#9e9e9e' },
  deleted: { label: 'Deleted', color: '#d50000' }
};

export const TRANSACTION_STATUS = {
  pending: { label: 'Pending', color: '#fbc02d' },
  succeed: { label: 'Succeed', color: '#64dd17' },
  failed: { label: 'Failed', color: '#d50000' }
};

export const DATE_FORMAT = 'yyyy/MM/DD';
export const HOUR_FORMAT = 'HH:mm:ss';
