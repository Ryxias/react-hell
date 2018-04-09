'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';

import moment from 'moment-timezone';

/**
 * Stateless component
 *
 *  - function
 */
const WorldClockDisplay = ({ timezone, unixtimestamp }) => {
  const now = moment(unixtimestamp).tz(timezone);

  return (
    <div>
      Time is now {now.format('LTS')}.
    </div>
  );
};

WorldClockDisplay.propTypes = {
  timezone: PropTypes.string.isRequired,
  unixtimestamp: PropTypes.number.isRequired,
};

export default WorldClockDisplay;
