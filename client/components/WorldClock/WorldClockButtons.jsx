'use strict';

import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const WorldClockButtons = ({ addClock }) => {
  return (
    <div>
      <Button className="clock-button" onClick={addClock}>Add Clock</Button>
    </div>
  );
};

WorldClockButtons.propTypes = {
  addClock: PropTypes.func.isRequired,
}

export default WorldClockButtons;
