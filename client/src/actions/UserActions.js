import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  USER_LOGOUT,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR
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

export const changePassword = (type, body) => {
  return fetchApi(`/${type}/updatePassword`, 'PUT', body);
};

export const updateProfile = (type, body) => async dispatch => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    await fetchApi(`/${type}/me`, 'PUT', body);

    message.success('Update information successful');

    dispatch({ type: UPDATE_USER_SUCCESS, payload: { userUpdated: body } });
  } catch (err) {
    dispatch({ type: UPDATE_USER_ERROR });
    message.error(getErrorMessage(err));
  }
};

export const passwordRecovery = body => {
  return fetchApi(`/customers/forgotPassword`, 'POST', body);
};

export const passwordReset = body => {
  return fetchApi('/customers/resetPassword', 'POST', body);
};
