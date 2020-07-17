import axios from 'axios';
import camelize from 'camelize';
import * as config from './../constants/UrlAPI';
import { readCookie, eraseCookie } from './helpers';
import { TOKEN_KEY } from '../constants/GlobalConstants';
import { history } from './helpers';

const instanceNext = axios.create({
  baseURL: config.API_URL,
  timeout: 10000
});

//config send request header
instanceNext.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      const token = readCookie(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

//config response
instanceNext.interceptors.response.use(
  response => camelize(response.data),
  error => {
    // token expiry or call api without token
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 403)
    ) {
      // clear token
      eraseCookie(TOKEN_KEY);

      // redirect to login page
      history.push('/login');
    }

    if (error.response) {
      return Promise.reject(error.response);
    }
    if (error.request) {
      return Promise.reject(error.request);
    }
    return Promise.reject(error.message);
  }
);

/*
 * @params: {endpoint} : url api
 * @params: {method} : method
 * @params: {body} : body request
 * @params: {params} : params on url
 * @params: {cancelToken} : cancel request token
 */
export const fetchApi = async (
  endpoint,
  method = 'GET',
  body,
  params = {},
  sourceToken = null
) => {
  return instanceNext({
    method,
    url: endpoint,
    data: body,
    params,
    cancelToken: sourceToken
  });
};

export const fetchAll = async (requests = []) => axios.all(requests);
