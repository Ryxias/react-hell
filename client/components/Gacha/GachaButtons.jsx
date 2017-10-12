import React from 'react';

const GachaButtons = ({ getGacha }) => {
  return (
    <div className="aidoru-buttons">
      <button className="btn gacha-button" onClick={getGacha}>Re-roll</button>
      <button className="btn gacha-button">Share this waifu</button>
    </div>
  );
};

export default GachaButtons;
