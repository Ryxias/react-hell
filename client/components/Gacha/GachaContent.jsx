'use strict';

import React from 'react';
import { CSSTransition } from 'react-transition-group';

import GachaButtons from './GachaButtons.jsx';

const GachaContent = (props) => {
  const {
    animationPhase,
    idolized,
    card,
    handleRerollGacha, handleEnvelopeOpen, handleShareWaifu, handleIdolCardClick
  } = props;

  const buttonProps = {
    handleRerollGacha,
    handleShareWaifu,
    card_stats: card.card_stats,
  };

  const imageUrl = animationPhase === 'opening'
    ? '/statics/i/' + card.envelope_image_open
    : '/statics/i/' + card.envelope_image_closed;

  const has_idolized_image = !!card.card_idolized_image_url && card.card_idolized_image_url !== card.card_image_url;

  return (
    <div className="gacha-container">
      {animationPhase !== 'open_finished'
        ? (
          <div className="envelope-image-container">
            <CSSTransition
              in={animationPhase === 'opening'}
              classNames="envelope"
              timeout={{ enter: 450, exit: 300 }}>

              <img onClick={handleEnvelopeOpen} className="envelope-image animated rotateIn" src={imageUrl} />
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
          <CSSTransition
            in={idolized}
            classNames="normal-card"
            timeout={{ enter: 300, exit: 300 }}>

            <img onClick={handleIdolCardClick} className="aidoru-image" src={card.card_image_url}/>
          </CSSTransition>
          { has_idolized_image
            ? (
              <CSSTransition
                in={idolized}
                classNames="idolized-card"
                timeout={{ enter: 300, exit: 300 }}>
                <img onClick={handleIdolCardClick} className="aidoru-image idolized" src={card.card_idolized_image_url}/>
              </CSSTransition>
            )
            : null
          }
          <GachaButtons {...buttonProps} />
        </div>
      </CSSTransition>
    </div>
  );
};

export default GachaContent;
