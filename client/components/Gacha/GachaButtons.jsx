import React from 'react';
import { Button } from 'react-bootstrap';

const GachaButtons = ({ getGacha, handleShareWaifu }) => {
  return (
    <div className="aidoru-buttons">
      <Button className="gacha-button" onClick={getGacha}>Re-roll</Button>
      <Button className="gacha-button" onClicj={handleShareWaifu}>Share this waifu</Button>
    </div>
  );
};

export default GachaButtons;
