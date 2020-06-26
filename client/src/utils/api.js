import axios from 'axios';
import camelize from 'camelize';
import * as config from './../constants/UrlAPI';

const instanceNext = axios.create({
  baseURL: config.API_URL,
  timeout: 10000
});

//config send request header
instanceNext.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

//config response
instanceNext.interceptors.response.use(
  response => camelize(response.data),
  error => {
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
export const fetchApi = async ({
  endpoint,
  method = 'GET',
  body,
  params = {},
  sourceToken = null
}) => {
  return instanceNext({
    method,
    url: endpoint,
    data: body,
    params,
    cancelToken: sourceToken
  });
};

export const fetchAll = async (requests = []) => axios.all(requests);
