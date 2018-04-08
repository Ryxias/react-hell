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
    <Navbar.Text className="navbar-text">
      Time is now {now.format('LTS')} at
    </Navbar.Text>
  );
};

WorldClockDisplay.propTypes = {
  timezone: PropTypes.string.isRequired,
  unixtimestamp: PropTypes.number.isRequired,
};

export default WorldClockDisplay;
