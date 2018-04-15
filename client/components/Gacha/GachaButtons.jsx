import React from 'react';
import { Button } from 'react-bootstrap';

const GachaButtons = ({ handleRerollGacha, handleShareWaifu }) => {
  return (
    <div className="aidoru-buttons">
      <Button className="gacha-button" onClick={handleRerollGacha}>Re-roll</Button>
      <Button className="gacha-button" onClick={handleShareWaifu}>Share this waifu</Button>
    </div>
  );
};

export default GachaButtons;
