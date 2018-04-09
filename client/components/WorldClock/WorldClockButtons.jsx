import React from 'react';
import { Button } from 'react-bootstrap';

const WorldClockButtons = ({ addClock }) => {
  return (
    <div>
      <Button className="clock-button" onClick={addClock}>Add Clock</Button>
    </div>
  );
};

export default WorldClockButtons;
