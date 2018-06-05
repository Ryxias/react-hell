'use strict';

const FileSweeper = require('../../../../lib/FileSweeper/FileSweeper');

// Initialize sinon and chai's assertion library compatible with sinon
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const Timer = {
  elapsed: 0,
  start: sinon.spy(),
  reset: sinon.spy(),
};

const dependencies = [
  require('../../../../lib/FileSweeper/utils/menuTypes'),
  new (require('../../../../lib/FileSweeper/utils/Timer'))(),
  new (require('../../../../lib/FileSweeper/utils/Handler'))().invalidInput,
  new (require('../../../../lib/FileSweeper/utils/Fetcher'))(this.httpClient).fetchList,
  require('axios'),
  (require('../../../../config/config').fsd_workspace.legacy_token),
];

const app = new FileSweeper(...dependencies);

describe('----- Slack File Sweeper -----', () => {

  beforeEach(() => {
    // set up mock methods here?

  });

  it('should initially go to main menu when the app starts', () => {
    const mainMenuSpy = sinon.spy(app, 'mainMenu');

    app.start();

    expect(mainMenuSpy).to.have.been.called;
  });

  it('should properly handle user input from the main menu prompt', () => {
    app.rl = {
      question: function () {
        app.handleMainMenuOption('1' ,'mainMenu');
      },
    };
    const handleMainMenuOptionSpy = sinon.spy(app, 'handleMainMenuOption'); // attach spy to handleMainMenuOption
    const stub = sinon.stub(app, 'filterMenu'); // to stop filterMenu from being called within handleMainMenuOption

    app.mainMenu();

    expect(handleMainMenuOptionSpy).to.have.been.calledWith('1', 'mainMenu');

    stub.restore(); // return filterMenu back to functional state
  });

  it('should properly fetch recent files of ALL types from the Slack team server', () => {
    return app.fetchList(app, 'all')
      .then(result => {
        expect(result.length).to.equal(5);
      });
  });

  it('should properly fetch recent files of IMAGE types from the Slack team server', () => {
    return app.fetchList(app, 'images')
      .then(result => {
        expect(result.length).to.equal(5);
      });
  });

  it('should properly fetch recent files of VIDEO types from the Slack team server', () => {
    return app.fetchList(app, 'videos')
      .then(result => {
        expect(result.length).to.equal(5);
      });
  });

});
