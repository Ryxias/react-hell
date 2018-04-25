'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

/**
 * Stateless component
 *
 *  - function
 */
const WorldClockDisplay = ({ unixtimestamp, timezone, region }) => {
  const now = moment(unixtimestamp).tz(timezone);

  return (
    <div className="animated fadeInDown">
      The time is now {now.format('LTS')} in {region}.
    </div>
  );
};

WorldClockDisplay.propTypes = {
  unixtimestamp: PropTypes.number.isRequired,
  timezone: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default WorldClockDisplay;
