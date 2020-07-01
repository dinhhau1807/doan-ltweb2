import { lazy } from 'react';
import { PrivateLayout, PublicLayout } from './layouts';

const UserPage = lazy(() => import('./pages/UserPage'));
const TodoPage = lazy(() => import('./pages/TodoPage'));
const NotFound = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

export const routes = [
  {
    path: '/',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: UserPage
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
    path: '/todo',
    exact: true,
    isPrivate: true,
    layout: PrivateLayout,
    component: TodoPage
  },
  {
    path: '*',
    layout: PublicLayout,
    component: NotFound
  }
];
