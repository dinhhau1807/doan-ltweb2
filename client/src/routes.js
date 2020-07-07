import { lazy } from 'react';
import { PrivateLayout, PublicLayout } from './layouts';
import StaffsManagementPage from './pages/StaffsManagementPage';

const UserPage = lazy(() => import('./pages/UserPage'));
const NotFound = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginStaffPage = lazy(() => import('./pages/LoginStaffPage'));
const CustomersManagement = lazy(() =>
  import('./pages/CustomersManagementPage')
);
const StaffsManagement = lazy(() => import('./pages/StaffsManagementPage'));

export const routes = [
  {
    path: '/',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: UserPage
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
