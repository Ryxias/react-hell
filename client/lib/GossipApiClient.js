'use strict';

import ApiClient from './ApiClient';


class GossipApiClient extends ApiClient {
  constructor(host) {
    super(host);
  }

  getGossipIndex(page_number, page_size) {
    return this._GET('/api/gossips', { page: page_number, page_size });
  }

  getGossip(id) {
    return this._GET(`/api/gossips/${id}`);
  }

  deleteGossip(id) {
    return this._DELETE(`/api/gossips/${id}`);
  }
}
export default GossipApiClient;
