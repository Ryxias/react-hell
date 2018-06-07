// 'use strict';
//
//
// // Setup only Slackbots
// const AppKernel = require('../../../app/AppKernel');
// const app_kernel = new AppKernel('test');
//
// const channel_id = 'CB1U36U00'; // channel for testing
//
// describe('----- Slack Bot Connection -----', () => {
//   beforeEach(() => {
//     app_kernel.boot();
//   });
//
//   afterEach(() => {
//     app_kernel.shutdown();
//   });
//
//
//   it('should be able to connect chuubot online', () => {
//     app_kernel.getContainer().get('chuubot').connect().then(() => {
//       expect(app_kernel.getContainer().get('chuubot').is_connected).to.be(true);
//     });
//   });
//
//   it('should be able to connect chuubot online', () => {
//     app_kernel.getContainer().get('nicobot').connect().then(() => {
//       expect(app_kernel.getContainer().get('nicobot').is_connected).to.be(true);
//     });
//   });
// });


