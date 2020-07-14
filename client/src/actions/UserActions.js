import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  USER_LOGOUT
} from '../constants/actions';
import { fetchApi } from '../utils/api';
import { getErrorMessage, eraseCookie } from '../utils/helpers';
import { TOKEN_KEY } from '../constants/GlobalConstants';
import { message } from 'antd';

export const fetchUser = type => async dispatch => {
  try {
    dispatch({ type: FETCH_USER_REQUEST });
    const { data } = await fetchApi(`/${type}/me`, 'GET');
    dispatch({ type: FETCH_USER_SUCCESS, payload: { user: data } });
  } catch (err) {
    message.error(getErrorMessage(err));
  }
};

export const login = (url, body) => {
  return fetchApi(url, 'POST', body);
};

export const register = body => {
  return fetchApi('/customers/register', 'POST', body);
};

export const logout = () => {
  eraseCookie(TOKEN_KEY);
  return { type: USER_LOGOUT };
};
