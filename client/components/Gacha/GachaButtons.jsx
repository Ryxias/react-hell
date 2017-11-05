import React from 'react';
import { Button } from 'react-bootstrap';

const GachaButtons = ({ getGacha }) => {
  return (
    <div className="aidoru-buttons">
      <Button className="gacha-button" onClick={getGacha}>Re-roll</Button>
      <Button className="gacha-button">Share this waifu</Button>
    </div>
  );
};

export default GachaButtons;
