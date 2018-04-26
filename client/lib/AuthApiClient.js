'use strict';

import ApiClient from './ApiClient';

class AuthApiClient extends ApiClient {
  constructor(host) {
    super(host);
  }

  login(email, password) {
    return this._POST('/api/auth/login', { email, password });
  }

  logout() {
    return this._POST('/api/auth/logout');
  }

  register(email, password) {
    return this._POST('/api/auth/register', { email, password });
  }

  whoami() {
    return this._GET('/api/auth/whoami');
  }

  requestSlackToken() {
    return this._POST('/api/auth/slack_token');
  }
}

export default AuthApiClient;
