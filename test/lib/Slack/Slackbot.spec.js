// 'use strict';
//
// // Setup only Slackbots
// const AppKernel = require('../../../app/AppKernel');
// const app_kernel = new AppKernel(process.env.NODE_ENV === 'local' ? 'local' : 'test');
//
// const channel_id = 'CB1U36U00'; // channel for testing
//
// // Initialize sinon and chai's assertion library compatible with sinon
// const chai = require('chai');
// // const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
// const expect = chai.expect;
// chai.use(sinonChai);
//
// describe('----- Slack Bot Connection (SANITY CHECK) -----', () => {
//   beforeEach(() => {
//     app_kernel.boot();
//   });
//
//   afterEach(() => {
//     app_kernel.shutdown();
//   });
//
//   it('should be able to connect chuubot online', (done) => {
//     app_kernel.getContainer().get('chuubot').connect();
//     setTimeout(() => {
//       expect(app_kernel.getContainer().get('chuubot').is_connected).to.equal(true);
//       done();
//     }, 1000);
//   });
//
//   it('should be able to connect nicobot online', (done) => {
//       app_kernel.getContainer().get('nicobot').connect();
//       setTimeout(() => {
//         expect(app_kernel.getContainer().get('nicobot').is_connected).to.equal(true);
//         done();
//       }, 1000);
//   });
// });


