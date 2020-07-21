import { lazy } from 'react';
import { PrivateLayout, PublicLayout } from './layouts';

const UserPage = lazy(() => import('./pages/UserPage'));
const UserPasswordPage = lazy(() => import('./pages/UserPasswordPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));

const NotFound = lazy(() => import('./pages/NotFoundPage'));

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginStaffPage = lazy(() => import('./pages/LoginStaffPage'));

const CustomersManagement = lazy(() =>
  import('./pages/CustomersManagementPage')
);
const StaffsManagement = lazy(() => import('./pages/StaffsManagementPage'));
const IdentitiesManagement = lazy(() =>
  import('./pages/IdentitiesManagementPage')
);
const IdentityDetails = lazy(() => import('./pages/IdentityDetailsPage'));
const TransactionsManagement = lazy(() =>
  import('./pages/TransactionsManagementPage')
);

export const routes = [
  {
    path: '/',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: UserPage
  },
  {
    path: '/password',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: UserPasswordPage
  },
  {
    path: '/profile',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: UserProfilePage
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
    path: '/a2hl-management/login',
    exact: true,
    layout: PublicLayout,
    component: LoginStaffPage
  },
  {
    path: '/login',
    exact: true,
    layout: PublicLayout,
    component: LoginPage
  },
  {
    path: '/register',
    exact: true,
    layout: PublicLayout,
    component: RegisterPage
  },
  {
    path: '*',
    layout: PublicLayout,
    component: NotFound
  }
];
