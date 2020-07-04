import { FETCH_USER_REQUEST, FETCH_USER_SUCCESS } from '../constants/actions';
import { fetchApi } from '../utils/api';

export const fetchUser = () => async dispatch => {
  try {
    dispatch({ type: FETCH_USER_REQUEST });
    const data = await fetchApi('/');
    dispatch({ type: FETCH_USER_SUCCESS, payload: { user: data } });
  } catch (err) {
    console.error(err);
  }
};

export const login = body => {
  return fetchApi('/customers/login', 'POST', body);
};
