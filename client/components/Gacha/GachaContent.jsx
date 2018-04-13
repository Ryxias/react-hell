'use strict';

import React from 'react';

import GachaButtons from './GachaButtons.jsx';

const GachaContent = ({ card, getGacha, handleShareWaifu }) => {

  const buttonProps = {
    getGacha,
    handleShareWaifu,
  };

  return (
    <div className="gacha-container">
      <div className="envelope-image-container">
        <img className="envelope-image envelope-closed" src={"/statics/i/" + card.envelope_image_closed} />
        <img className="envelope-image envelope-open hide" src={"/statics/i/" + card.envelope_image_open} />
      </div>
      <div className="opened-card-container hide">
        <span className="aidoru-name">
          <a href={card.card_ext_link}>{card.card_title}</a>
        </span>
        <img className="aidoru-image" src={card.card_image_url}/>
        <GachaButtons getGacha={...buttonProps} />
      </div>
      <div className="data" data-open-sound-url={"/statics/sound/" + card.open_sound}></div>
    </div>
  );
};

export default GachaContent;
