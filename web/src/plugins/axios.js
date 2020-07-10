/*
 * @Author: your name
 * @Date: 2020-05-08 10:56:38
 * @LastEditTime: 2020-07-07 00:55:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-manage-system\src\plugins\axios.js
 */
"use strict";

import Vue from 'vue';
import axios from "axios";
import router from '../router/index'

// Full config:  https://github.com/axios/axios#request-config
axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: 'http://localhost:8890/api',
  baseURL: 'http://58.216.47.108:8890/api',

  // baseURL: process.env.baseURL || process.env.apiUrl || "",
  timeout: 60 * 1000, // Timeout
  // withCredentials: true // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    console.log(config)
    if (localStorage.token) {
      config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    // window.console.log(error.response);
    if (error.response.data.message) {
        Vue.prototype.$message({
          type: 'error',
          message: error.response.data.message
        })
      window.console.log(error.response.status);
      if (error.response.status === 401) {
        router.push('/login')
      } else if (error.response.status === 403) {
        router.push('/403')
        // Vue.router.push('403')
        // console.log(router)
      }
    }
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;