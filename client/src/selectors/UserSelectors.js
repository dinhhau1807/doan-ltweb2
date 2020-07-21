import { createSelector } from 'reselect';

const getUserState = state => state.user;

export const getUser = createSelector(getUserState, user => user);
