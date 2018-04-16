'use strict';

import axios from 'axios';

class ApiClient {
  constructor(host = '') {
    this.host = host;
  }

  /**
   * Query parameters is an object mapping parameter names to values
   */
  _GET(path, query_parameters = {}) {
    const query = (() => {
      if (!query_parameters) {
        return '';
      }

      return '?' + Object.keys(query_parameters)
        .map(key => `${key}=${query_parameters[key]}`)
        .join('&');
    })(query_parameters);

    return axios.get(encodeURI(this._URL(path) + query))
      .then(this._parseResponse)
      .catch(this._parseError);
  }

  _POST(path, body = {}) {
    return axios.post(encodeURI(this._URL(path)), body)
      .then(this._parseResponse)
      .catch(this._parseError);
  }

  _DELETE(path) {
    return axios.delete(encodeURI(this._URL(path)))
      .then(this._parseResponse)
      .catch(this._parseError);
  }

  _URL(path) {
    return `${this.host}${path}`;
  }

  /**
   * Response is an axios thing
   */
  _parseResponse(response) {
    const data = response.data;
    return Promise.resolve({
      status: response.status,
      system_code: data.system_code || null,
      message: data.message || '',
      data: data,
    });
  }

  /**
   * Error is an axios thing
   */
  _parseError(error) {
    const response = error.response;
    const data = response.data;

    const res = new Error(data.message);
    res.status = response.status;
    res.system_code = data.system_code;
    res.data = data;
    return Promise.reject(res);
  }
}

export default ApiClient;
