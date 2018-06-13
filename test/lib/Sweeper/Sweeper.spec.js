'use strict';

const FileSweeper = require('../../../lib/FileSweeper/FileSweeper');

// Initialize sinon and chai's assertion library compatible with sinon
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const MockAdapter = require('axios-mock-adapter');

const dependencies = [
  require('../../../lib/FileSweeper/utils/menuTypes'),
  new (require('../../../lib/FileSweeper/utils/Timer'))(),
  new (require('../../../lib/FileSweeper/utils/Handler'))().invalidInput,
  new (require('../../../lib/FileSweeper/utils/Fetcher'))().fetchList,
  require('axios'),
  (process.env.NODE_ENV === 'test' ? require('../../../config/config_test').fsd_workspace.legacy_token : require('../../../config/config_local').fsd_workspace.legacy_token),
];

const app = new FileSweeper(...dependencies);

describe('----- Slack File Sweeper -----', () => {

  beforeEach(() => {
    // set up common mock methods here?
  });

  afterEach(() => {
    // set up common restores here?
    sinon.restore();
  });

  it('should initially go to main menu when the app starts', () => {
    const fake = sinon.fake();
    sinon.replace(app, 'mainMenu', fake);  // replaces with anonymous fake function

    app.start();

    expect(app.mainMenu).to.have.been.calledOnce;
  });

  it('should properly handle user input from the main menu prompt', () => {
    const fake = sinon.fake();
    sinon.replace(app, 'handleMainMenuOption', fake);  // replaces with anonymous fake function
    const stub = sinon.stub(app.rl, 'question').callsFake(() => {
      app.handleMainMenuOption('1' ,'mainMenu');
    });  // stub function with spying capabilities that calls specified fake method

    app.mainMenu();

    expect(app.handleMainMenuOption).to.have.been.calledWith('1', 'mainMenu');
    stub.restore(); // restore methods replaced by stubs to their original properties
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

  it('should properly handle user decision for deletion from the filter menu prompt', () => {
    const fake = sinon.fake();
    sinon.replace(app, 'handleDeletionOption', fake);  // replaces with anonymous fake function
    const stub = sinon.stub(app.rl, 'question').callsFake(() => {
      app.handleDeletionOption('all', 'Y');
    });  // stub function with spying capabilities that calls specified fake method

    app.confirmDeletion();

    expect(app.handleDeletionOption).to.have.been.calledWith('all', 'Y');
    stub.restore(); // restore methods replaced by stubs to their original properties
  });

  it('should return to main menu and list cleared if user answers no for deletion', () => {
    const fake = sinon.fake();
    sinon.replace(app, 'mainMenu', fake);  // replaces with anonymous fake function

    app.handleDeletionOption('all', 'N');

    expect(app.mainMenu).to.have.been.calledOnce;
    expect(app.list.length).to.equal(0);
  });

  it('should handle invalid user input if user does not answer yes or no for deletion', () => {
    const fake = sinon.fake();
    sinon.replace(app, 'handleInvalidInput', fake);  // replaces with anonymous fake function

    app.handleDeletionOption('all', 'NOU');

    expect(app.handleInvalidInput).to.have.been.calledOnce;
  });

  it('should run the file deletion method if user answers yes for deletion', () => {
    const fake = sinon.fake();
    sinon.replace(app, 'deleteFiles', fake);  // replaces with anonymous fake function

    app.handleDeletionOption('all', 'Y');

    expect(app.deleteFiles).to.have.been.calledOnce;
  });

  it('should clear file list and return to main menu if user answers no for deletion', () => {
    app.list = [{
      id: 9999999999999999
    }];
    const fake = sinon.fake();
    sinon.replace(app, 'mainMenu', fake);  // replaces with anonymous fake function

    app.handleDeletionOption('all', 'N');

    expect(app.list.length).to.equal(0);
    expect(app.deleted.length).to.equal(0);
    expect(app.mainMenu).to.have.been.calledOnce;
  });


  it('should properly execute deletion actions upon calling deleteFiles()', () => {
    const fake = sinon.fake();
    sinon.replace(app, 'finishDeletion', fake);  // replaces with anonymous fake function
    const mock = new MockAdapter(app.httpClient);
    app.list = [{
      id: 9999999999999999
    }];
    mock.onPost().reply(200, app.list);  // always return 200 OK for ALL mock post requests

    app.deleteFiles()
      .then(() => {
        expect(app.finishDeletion).to.have.been.calledOnce;
        mock.restore();
      });
  });

  it('should properly run clear/reset methods when finishDeletion is called', () => {
    app.deleted = [{
      id: 9999999999999999
    }];
    app.list = [{
      id: 9999999999999999
    }];
    const fake = sinon.fake();
    const fake2 = sinon.fake();
    sinon.replace(app.timer, 'start', fake);
    sinon.replace(app, 'mainMenu', fake2);

    app.finishDeletion();

    expect(app.list.length).to.equal(0);
    expect(app.deleted.length).to.equal(0);
    expect(app.timer.start).to.have.been.calledOnce;
    expect(app.mainMenu).to.have.been.calledOnce;
  });
});
