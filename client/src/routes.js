import { lazy } from 'react';
import { PrivateLayout, PublicLayout } from './layouts';

const UserPassword = lazy(() =>
  import('./components/UserPassword/UserPassword')
);
const UserProfile = lazy(() => import('./components/UserProfile/UserProfile'));
const UserLogs = lazy(() => import('./components/UserLogs/UserLogs'));

const CustomerAccount = lazy(() =>
  import('./components/CustomerAccount/CustomerAccount')
);
const AccountTransactions = lazy(() =>
  import('./components/AccountTransactions/AccountTransactions')
);
const OpenDepositAccount = lazy(() =>
  import('./components/OpenDepositAccount/OpenDepositAccount')
);
const CloseDepositAccount = lazy(() =>
  import('./components/CloseDepositAccount/CloseDepositAccount')
);
const DepositTransactions = lazy(() =>
  import('./components/DepositTransactions/DepositTransactions')
);

const TransferInsideSystem = lazy(() =>
  import('./components/TransferInsideSystem/TransferInsideSystem')
);
const TransferOutsideSystem = lazy(() =>
  import('./components/TransferOutsideSystem/TransferOutsideSystem')
);

const NotFound = lazy(() => import('./components/NotFound/NotFound'));

const Login = lazy(() => import('./components/Login/Login'));
const Register = lazy(() => import('./components/Register/Register'));
const LoginStaff = lazy(() => import('./components/LoginStaff/LoginStaff'));
const PasswordRecovery = lazy(() =>
  import('./components/PasswordRecovery/PasswordRecovery')
);
const PasswordReset = lazy(() =>
  import('./components/PasswordReset/PasswordReset')
);

const CustomersManagement = lazy(() =>
  import('./components/CustomersManagement/CustomersManagement')
);
const CustomerDetails = lazy(() =>
  import('./components/CustomerDetails/CustomerDetails')
);
const StaffsManagement = lazy(() =>
  import('./components/StaffsManagement/StaffsManagement')
);
const IdentitiesManagement = lazy(() =>
  import('./components/IdentitiesManagement/IdentitiesManagement')
);
const IdentityDetails = lazy(() =>
  import('./components/IdentityDetails/IdentityDetails')
);
const TransactionsManagement = lazy(() =>
  import('./components/TransactionsManagement/TransactionsManagement')
);

export const routes = [
  {
    path: '/',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: CustomerAccount
  },
  {
    path: '/account',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: CustomerAccount
  },
  {
    path: '/account/history',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: AccountTransactions
  },
  {
    path: '/deposit',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: OpenDepositAccount
  },
  {
    path: '/deposit/request',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: OpenDepositAccount
  },
  {
    path: '/deposit/withdraw',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: CloseDepositAccount
  },
  {
    path: '/deposit/history',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: DepositTransactions
  },
  {
    path: '/transfer',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: TransferInsideSystem
  },
  {
    path: '/transfer/inside',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: TransferInsideSystem
  },
  {
    path: '/transfer/outside',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: TransferOutsideSystem
  },
  {
    path: '/utils',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: UserProfile
  },
  {
    path: '/utils/profile',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: UserProfile
  },
  {
    path: '/utils/password',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: UserPassword
  },
  {
    path: '/a2hl-management',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: CustomersManagement
  },
  {
    path: '/a2hl-management/customers',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: CustomersManagement
  },
  {
    path: '/a2hl-management/customers/:id',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: CustomerDetails
  },
  {
    path: '/a2hl-management/staffs',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: StaffsManagement
  },
  {
    path: '/a2hl-management/identities',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: IdentitiesManagement
  },
  {
    path: '/a2hl-management/identities/:id',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: IdentityDetails
  },
  {
    path: '/a2hl-management/transaction',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: TransactionsManagement
  },
  {
    path: '/a2hl-management/utils',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: UserProfile
  },
  {
    path: '/a2hl-management/utils/profile',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: UserProfile
  },
  {
    path: '/a2hl-management/utils/password',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: UserPassword
  },
  {
    path: '/a2hl-management/utils/logs',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: UserLogs
  },
  {
    path: '/a2hl-management/login',
    exact: true,
    layout: PublicLayout,
    component: LoginStaff
  },
  {
    path: '/login',
    exact: true,
    layout: PublicLayout,
    component: Login
  },
  {
    path: '/register',
    exact: true,
    layout: PublicLayout,
    component: Register
  },
  {
    path: '/password-recovery',
    exact: true,
    layout: PublicLayout,
    component: PasswordRecovery
  },
  {
    path: '/password-reset/:code',
    exact: true,
    layout: PublicLayout,
    component: PasswordReset
  },
  {
    path: '*',
    layout: PublicLayout,
    component: NotFound
  }
];
