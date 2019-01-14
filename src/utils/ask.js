/**
 * 请求数据
 */
import axios from 'axios';

function ask(name, options = {}) {
  const token = localStorage.getItem('token');
  const path = name;
  let type = options.method || 'GET';
  let { data, params, responseType, auth } = options;
  let instance = axios.create({
    // baseURL: 'http://47.75.49.202:8080/api',
    baseURL: 'http://120.133.26.118/api',
  });
  let headers = {
    Authorization: 'Bearer' + token,
    'Content-Type': 'application/json',
  };
  let promise = instance.request({
    responseType,
    url: path,
    method: type,
    headers: options.headers || headers,
    auth: auth,
    params: params,
    data: data,
  });
  return promise;
}

export default ask;
