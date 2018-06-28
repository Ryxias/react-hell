'use strict';

const { expect } = require('chai');

describe('BangDream/Client', function() {
  const service_container = require('../../../services/container');
  const Client = service_container.get('BangDreamClient');
  const Card = require('../../../lib/BangDream/Card');

  describe('getCard', function() {

    describe('with a known working card', function() {
      const id = 501;

      it('returns a card', function() {
        return Client.getCard(id)
          .then(result => {
            expect(result).to.be.an.instanceOf(Card);
            expect(result.getId()).to.equal(id);
          });
      });
    });

    describe('with a non-working card', function() {
      const id = 999999999999;

      it('returns an error', function() {
        return Client.getCard(id)
          .then(result => {
            expect(result).to.be.an.instanceOf(Error);
          });
      });
    });
  });

  describe('getRandomCard', function() {
    it('works', function() {
      return Client.getRandomCard()
        .then(result => {
          expect(result).to.be.an.instanceOf(Card);
          expect(result.getId()).to.be.ok;
        });
    });

    it('saves the memoized_last_page_id so subsequent calls are faster', function() {
      return Client.getRandomCard()
        .then(result => {
          expect(Client.memoized_last_page_id).to.be.above(35); // last I checked it was 36 pages
        });
    });
  });

  describe('doBangDriCall', function() {
    it('works with valid page', function() {
      return Client.doBangDriCall(`/api/cards/?page=1`)
        .then(response => {
          expect(response).to.not.be.an.instanceOf(Error);
          expect(response).to.have.property('results');
        });
    });

    it('errors with invalid page', function() {
      return Client.doBangDriCall(`/api/cards/?page=9090909090909`)
        .catch(response => {
          expect(response).to.be.an.instanceOf(Error);
        });
    });
  });

});
