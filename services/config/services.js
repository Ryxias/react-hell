'use strict';

module.exports = service_container => {

  service_container.set('service_container', service_container);
  service_container.alias('ServiceContainer', 'service_container');


  // chuuni boot scripts and stuff




  // Configuration manager
  service_container.registerFactory('app.config', service_container => {
    const ConfigurationManager = require('../..//lib/Configuration/ConfigurationManager');
    return new ConfigurationManager(require('../../configuration_loader'));
  });
  service_container.alias('ConfigurationManager', 'app.config');

  // Database connection
  service_container.registerFactory('database.connection_manager', require('./database_connection'));
  service_container.alias('ConnectionManager', 'database.connection_manager');


  // This should probably be on express
  service_container.set('express.session', require('express-session'));
  service_container.registerFactory('express.session_store', service_container => {
    const ExpressSession = service_container.get('express.session');
    const connectSessionSequelize = require('connect-session-sequelize');

    const SessionConnect = connectSessionSequelize(ExpressSession.Store);

    return new SessionConnect({
      db: service_container.get('ConnectionManager').sequelize_connection,
    });
  });
  service_container.registerFactory('express.session_config', service_container => {
    return {
      name: 'chuuni.me',
      // proxy: true,  // Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header).
      resave: false,  // Forces the session to be saved back to the session store if set to 'true', even if the session was never modified during the request.
      // rolling: true,  // Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown.
      saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store if set to 'true'.
      secret: service_container.get('ConfigurationManager').getValue('secret'),
      store: service_container.get('express.session_store'),
      cookie: {
        // expires: null,  // this will automatically be set via maxAge
        // httpOnly: production,  // Allows the use of Document.cookie in development mode, protects against Cross-Site Scripting (XSS) attacks
        maxAge: 300000,  // 5 minutes (in milliseconds)
        // path: '/',  // Designates a path that should exist in the requested source when sending the cookie header
        // secure: production,  // Does not necessarily encrypt cookie data as cookies are inherently insecure, see MDN documentation
        // sameSite: 'strict', // Protection against Cross-Site Request Forgery attacks if set to 'strict'
      }
    };
  });

  service_container.registerFactory('express.server', require('./express'));

  service_container.registerFactory('chuubot', require('../../init/chuubot'));


  service_container.autowire('database.model_validator', require('../../lib/Database/ModelValidator'));
  service_container.alias('ModelValidator', 'database.model_validator');

  // Model Stores
  {
    // FIXME (derek) in the future, we can automate this registration by scanning the /lib/ModelStores/ directory,
    // and registering them by classname.

    // service_container.autowire('database.model_store.question', require('../../lib/ModelStores/QuestionStore'));
    // service_container.autowire('database.model_store.question_review_element', require('../../lib/ModelStores/QuestionReviewElementStore'));
    // service_container.autowire('database.model_store.user_profile', require('../../lib/ModelStores/UserProfileStore'));
    // service_container.autowire('database.model_store.user', require('../../lib/ModelStores/UserStore'));
    // service_container.autowire('database.model_store.compiled_code', require('../../lib/ModelStores/CompiledCodeStore'));
    // service_container.autowire('database.model_store.exam', require('../../lib/ModelStores/ExamStore'));
    // service_container.autowire('database.model_store.exam_room', require('../../lib/ModelStores/ExamRoomStore'));
    // service_container.autowire('database.model_store.email_registry', require('../../lib/ModelStores/EmailRegistryStore'));
    // service_container.autowire('database.model_store.exam_session', require('../../lib/ModelStores/ExamSessionStore'));
    // service_container.autowire('database.model_store.organization', require('../../lib/ModelStores/OrganizationStore'));
    // service_container.autowire('database.model_store.user_exam', require('../../lib/ModelStores/UserExamStore'));
    // service_container.autowire('database.model_store.exam_invite', require('../../lib/ModelStores/ExamInviteStore'));
    // service_container.autowire('database.model_store.score_report', require('../../lib/ModelStores/ScoreReportStore'));
    // service_container.autowire('database.model_store.url_route', require('../../lib/ModelStores/UrlRouteStore'));
    // service_container.autowire('database.model_store.user_exam_state', require('../../lib/ModelStores/UserExamStateStore'));
    // service_container.autowire('database.model_store.user_answer', require('../../lib/ModelStores/UserAnswerStore'));
    // service_container.autowire('database.model_store.job_req', require('../../lib/ModelStores/JobReqStore'));
    // service_container.autowire('database.model_store.job_application', require('../../lib/ModelStores/JobApplicationStore'));
    // service_container.autowire('database.model_store.user_organization', require('../../lib/ModelStores/UserOrganizationStore'));
    // service_container.autowire('database.model_store.organization_invite', require('../../lib/ModelStores/OrganizationInviteStore'));
    // service_container.autowire('database.model_store.exam_session_registration', require('../../lib/ModelStores/ExamSessionRegistrationStore'));
    // service_container.autowire('database.model_store.stripe_charge', require('../../lib/ModelStores/StripeChargeStore'));
    //
    // service_container.alias('QuestionStore', 'database.model_store.question');
    // service_container.alias('QuestionReviewElementStore', 'database.model_store.question_review_element');
    // service_container.alias('UserProfileStore', 'database.model_store.user_profile');
    // service_container.alias('UserStore', 'database.model_store.user');
    // service_container.alias('CompiledCodeStore', 'database.model_store.compiled_code');
    // service_container.alias('ExamStore', 'database.model_store.exam');
    // service_container.alias('ExamRoomStore', 'database.model_store.exam_room');
    // service_container.alias('EmailRegistryStore', 'database.model_store.email_registry');
    // service_container.alias('ExamSessionStore', 'database.model_store.exam_session');
    // service_container.alias('OrganizationStore', 'database.model_store.organization');
    // service_container.alias('UserExamStore', 'database.model_store.user_exam');
    // service_container.alias('ExamInviteStore', 'database.model_store.exam_invite');
    // service_container.alias('ScoreReportStore', 'database.model_store.score_report');
    // service_container.alias('UrlRouteStore', 'database.model_store.url_route');
    // service_container.alias('UserExamStateStore', 'database.model_store.user_exam_state');
    // service_container.alias('UserAnswerStore', 'database.model_store.user_answer');
    // service_container.alias('JobReqStore', 'database.model_store.job_req');
    // service_container.alias('JobApplicationStore', 'database.model_store.job_application');
    // service_container.alias('UserOrganizationStore', 'database.model_store.user_organization');
    // service_container.alias('OrganizationInviteStore', 'database.model_store.organization_invite');
    // service_container.alias('ExamSessionRegistrationStore', 'database.model_store.exam_session_registration');
    // service_container.alias('StripeChargeStore', 'database.model_store.stripe_charge');
  }


  // Controllers
  {
    const { ControllerCompilerPass } = require('express-route-registry');

    service_container.autowire('app.controllers.debug', require('../../server/controllers/DebugController')).addTag('controller');
    service_container.addCompilerPass(new ControllerCompilerPass());
  }


};
