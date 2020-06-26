import { lazy } from 'react';
import { PrivateLayout } from './layouts/PrivateLayout';

const UserPage = lazy(() => import('./pages/UserPage'));
const TodoPage = lazy(() => import('./pages/TodoPage'));
const NotFound = lazy(() => import('./pages/NotFoundPage'));

export const routes = [
  {
    path: '/',
    exact: true,
    layout: PrivateLayout,
    component: UserPage
  },
  {
    path: '/todo',
    exact: true,
    layout: PrivateLayout,
    component: TodoPage
  },
  {
    path: '*',
    layout: PrivateLayout,
    component: NotFound
  }
];
