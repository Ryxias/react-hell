'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import moment from 'moment-timezone';

/**
 * Stateless component
 *
 *  - function
 */
const WorldClockDisplay = ({ unixtimestamp, timezone, region, deleteClock, index }) => {
  const now = moment(unixtimestamp).tz(timezone);

  return (
    <div>
      The time is now {now.format('LTS')} in {region}.  <Button bsStyle="danger" bsSize="small" onClick={() => deleteClock(index)}>X</Button>
    </div>
  );
};

WorldClockDisplay.propTypes = {
  unixtimestamp: PropTypes.number.isRequired,
  timezone: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  deleteClock: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default WorldClockDisplay;
