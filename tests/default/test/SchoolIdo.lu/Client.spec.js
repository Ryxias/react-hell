'use strict';

import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store'; // mock Redux store
import { configure, shallow, mount } from 'enzyme';  // shallow rendering to only render top level
import Adapter from 'enzyme-adapter-react-16';  // for Enzyme
import { Provider } from 'react-redux';

/*
 * testEnvironment variable needs to be changed to 'node' for these cross origin requests to work in jest
 * (default environment is jsdom).  The change is made via 'jest' config in package.json.
 * Reference: https://github.com/axios/axios/issues/1418
 */

import Client from '../../../../lib/SchoolIdo.lu/Client';

describe('SchoolIdo.lu Client', function() {
  const client = new Client();

  it('should be able to getCard', function() {
    // this makes an API call
    return client.getCard(1220).then(card => {
      // UR yousoro~
      expect(card.getId()).toEqual(1220);
      expect(card.getRarity()).toEqual('UR');
      expect(card.getName()).toEqual('Watanabe You');
      expect(card.getCollection()).toEqual('Time Travel');
      expect(card.getMainUnit()).toEqual('Aqours');
    });
  });
});
