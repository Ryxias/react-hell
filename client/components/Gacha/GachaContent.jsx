import React from 'react';

import GachaButtons from './GachaButtons.jsx';

const GachaContent = ({ gameState, getGacha }) => {
  return (
    <div className="gacha-container">
      <div className="envelope-image-container">
        <img className="envelope-image envelope-closed" src={"/statics/i/" + gameState.envelope_image_closed} />
        <img className="envelope-image envelope-open hide" src={"/statics/i/" + gameState.envelope_image_open} />
      </div>
      <div className="opened-card-container hide">
        <span className="aidoru-name">
          <a href={gameState.card_ext_link}>{gameState.card_title}</a>
        </span>
        <img className="aidoru-image" src={gameState.card_image_url}/>
        <GachaButtons getGacha={getGacha} />
      </div>
      <div className="data" data-open-sound-url={"/statics/sound/" + gameState.open_sound}></div>
    </div>
  );
};

export default GachaContent;
