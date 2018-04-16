'use strict';

import ApiClient from './ApiClient';

class AuthApiClient extends ApiClient {
  constructor(host) {
    super(host);
  }

  login(email, password) {
    return this._POST('/api/login', { email, password });
  }

  logout() {
    return this._POST('/api/logout');
  }

  register(email, password) {
    return this._POST('/api/register', { email, password });
  }

  whoami() {
    return this._GET('/api/whoami');
  }

  requestSlackToken() {
    return this._POST('/api/slack_token');
  }
}

export default AuthApiClient;
