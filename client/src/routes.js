import { lazy } from 'react';
import { PrivateLayout, PublicLayout } from './layouts';

const UserPassword = lazy(() =>
  import('./components/UserPassword/UserPassword')
);
const UserProfile = lazy(() => import('./components/UserProfile/UserProfile'));

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

const NotFound = lazy(() => import('./components/NotFound/NotFound'));

const Login = lazy(() => import('./components/Login/Login'));
const Register = lazy(() => import('./components/Register/Register'));
const LoginStaff = lazy(() => import('./components/LoginStaff/LoginStaff'));

const CustomersManagement = lazy(() =>
  import('./components/CustomersManagement/CustomersManagement')
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
    path: '/password',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: UserPassword
  },
  {
    path: '/history',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: AccountTransactions
  },
  {
    path: '/deposit-request',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: OpenDepositAccount
  },
  {
    path: '/deposit-withdraw',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: CloseDepositAccount
  },
  {
    path: '/deposit-history',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: DepositTransactions
  },
  {
    path: '/transaction',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: TransferInsideSystem
  },
  {
    path: '/profile',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: UserProfile
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
    path: '/a2hl-management/password',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: UserPassword
  },
  {
    path: '/a2hl-management/profile',
    exact: true,
    isPrivate: true,
    isStaffRoute: true,
    layout: PrivateLayout,
    component: UserProfile
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
    path: '*',
    layout: PublicLayout,
    component: NotFound
  }
];
