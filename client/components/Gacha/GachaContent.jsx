'use strict';

import React from 'react';
import { CSSTransition } from 'react-transition-group';

import GachaButtons from './GachaButtons.jsx';

const GachaContent = ({ animationPhase, card, handleRerollGacha, handleEnvelopeOpen, handleShareWaifu }) => {

  const buttonProps = {
    handleRerollGacha,
    handleShareWaifu,
  };

  const imageUrl = animationPhase === 'opening'
    ? '/statics/i/' + card.envelope_image_open
    : '/statics/i/' + card.envelope_image_closed;

  return (
    <div className="gacha-container">
      {animationPhase !== 'open_finished'
        ? (
          <div onClick={handleEnvelopeOpen} className="envelope-image-container">
            <CSSTransition
              in={animationPhase === 'opening'}
              classNames="envelope"
              timeout={{ enter: 450, exit: 300 }}
              onEntered={() => console.log('WOOHOOO!!!!!')}>

              <img className="envelope-image" src={imageUrl} />
            </CSSTransition>
          </div>
        )
        : null
      }
      <CSSTransition
        in={animationPhase === 'open_finished'}
        classNames="opened-card"
        timeout={{ enter: 600, exit: 300 }}>

        <div className="opened-card-container">
        <span className="aidoru-name">
          <a href={card.card_ext_link}>{card.card_title}</a>
        </span>
          <img className="aidoru-image" src={card.card_image_url}/>
          <GachaButtons {...buttonProps} />
        </div>
      </CSSTransition>
    </div>
  );
};

export default GachaContent;
