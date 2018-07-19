'use strict';

import { expect } from 'chai';

/*
 * testEnvironment variable needs to be changed to 'node' for these cross origin requests to work in jest
 * (default environment is jsdom).  The change is made via 'jest' config in package.json.
 * Reference: https://github.com/axios/axios/issues/1418
 */

import Client from '../../../lib/SchoolIdo.lu/Client';

describe('SchoolIdo.lu Client', function() {
  const client = new Client();

  it('should be able to getCard', function() {
    // this makes an API call
    return client.getCard(1220).then(card => {
      // UR yousoro~
      expect(card.getId()).to.equal(1220);
      expect(card.getRarity()).to.equal('UR');
      expect(card.getName()).to.equal('Watanabe You');
      expect(card.getCollection()).to.equal('Time Travel / Cyber');
      expect(card.getMainUnit()).to.equal('Aqours');
      expect(card.getSubUnit()).to.equal('CYaRon!');
      expect(card.getWebsiteUrl()).to.equal('http://schoolido.lu/cards/1220/UR-Watanabe-You-Time-Travel---Cyber-Smile/');
      expect(card.getImageUrl()).to.equal('https://i.schoolido.lu/c/1220You.png');
      expect(card.getIdolizedImageUrl()).to.equal('https://i.schoolido.lu/c/1220idolizedYou.png');
      expect(card.getCardStats()).to.deep.equal({
        name: 'Watanabe You',
        collection: 'Time Travel / Cyber',
        attribute: 'Smile',
        skill: 'Score Up',
        skill_details: 'For every 24 perfects, there is a 32% chance of increasing players score by 700 points. (Level 1)',
        center_skill: 'Smile Princess',
        center_skill_details: 'Smile increases drastically (+9%)',
        non_idolized_maximum_statistics_smile: 5020,
        non_idolized_maximum_statistics_pure: 4350,
        non_idolized_maximum_statistics_cool: 3620,
        idolized_maximum_statistics_smile: 5320,
        idolized_maximum_statistics_pure: 4650,
        idolized_maximum_statistics_cool: 3920,
      });
    });
  });

  it('should be able to getCards', function() {
    return client.getCards().then((result) => {
      expect(result.length).to.not.equal(0);
    });
  });
});
