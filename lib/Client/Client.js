'use strict';

const axios = require('axios');

class Client {
  constructor(host = null) {
    this.host = host;
  }

  rollGacha() {
    return axios.get(this.host + '/api/sif/roll');
  }

  login(email, password) {
    return axios.post(this.host + '/api/login', { email, password });
  }

}
module.exports = Client;

