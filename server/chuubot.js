//
// Start point for chuubot
//
'use strict';

const ChuubotApplication = require('../init/ChuubotApplication');
global.CHUUBOT_APP = new ChuubotApplication();

CHUUBOT_APP.boot();
