import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import GachaButtons from './GachaButtons.jsx';

const GachaContent = ({ gameState, getGacha, openEnvelope }) => {
  // const envelopeClosedClasses = ['envelope-image envelope-closed'];
  // const envelopeOpenedClasses = ['envelope-image envelope-open'];
  //
  // if (gameState.envelopeIsOpened) {
  //   envelopeClosedClasses.push('hide');
  //   envelopeOpenedClasses.push('reveal');
  //   console.log('transitioning to opened');
  //   console.log('what is envelopeOpened now:', envelopeOpenedClasses.join(' '));
  //   console.log('what is envelopeClosed now:', envelopeClosedClasses.join(' '));
  // } else {
  //   envelopeClosedClasses.push('reveal');
  //   envelopeOpenedClasses.push('hide');
  //   console.log('transitioning to closed');
  //   console.log('what is envelopeOpened now:', envelopeOpenedClasses.join(' '));
  //   console.log('what is envelopeClosed now:', envelopeClosedClasses.join(' '));
  // }

  return (
    <div className="gacha-container">
      <div className="envelope-image-container">
        <ReactCSSTransitionGroup
          transitionName="reveal"
          transitionEnterTimeout={450}
          transitionLeave={false}
          transitionAppear={true}
          transitionAppearTimeout={450}>
          {
            gameState.envelopeIsOpened ?
            <img key={1} className="envelope open" src={"/statics/i/" + gameState.envelope_image_open} /> :
            <img key={1} className="envelope closed" onClick={openEnvelope} src={"/statics/i/" + gameState.envelope_image_closed} />
          }
        </ReactCSSTransitionGroup>
      </div>
      <div className="opened-card-container hide">
        <span className="aidoru-name">
          <a href={gameState.card_ext_link}>{gameState.card_title}</a>
        </span>
        <img className="aidoru-image" src={gameState.card_image_url}/>
        <GachaButtons getGacha={getGacha} />
      </div>
    </div>
  );
};

export default GachaContent;
