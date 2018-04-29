import React from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

const stateDefault = {
  name: "",
  collection: "",
  attribute: "",
  skill: "",
  skill_details: "",
  center_skill: "",
  center_skill_details: "",
  non_idolized_maximum_statistics_smile: "",
  idolized_maximum_statistics_smile: "",
  non_idolized_maximum_statistics_pure: "",
  idolized_maximum_statistics_pure: "",
  non_idolized_maximum_statistics_cool: "",
  idolized_maximum_statistics_cool: "",
};

const GachaButtons = ({ handleRerollGacha, handleShareWaifu, card_stats = stateDefault }) => {

  const gachaInfoOverlay = (
    <Popover id="popover-trigger-click-root-close" title="Card Statistics">
      <strong>Name:</strong> {card_stats.name} <br/>
      <strong>Collection:</strong> {card_stats.collection} <br/>
      <strong>Attribute:</strong> {card_stats.attribute} <br/>
      <strong>Skill: [{card_stats.skill}]</strong> {card_stats.skill_details} <br/>
      <strong>Center Skill: [{card_stats.center_skill}]</strong> {card_stats.center_skill_details} <br/>
      <strong>Max Smile Points:</strong> {card_stats.non_idolized_maximum_statistics_smile} ~ {card_stats.idolized_maximum_statistics_smile} <br/>
      <strong>Max Pure Points:</strong> {card_stats.non_idolized_maximum_statistics_pure} ~ {card_stats.idolized_maximum_statistics_pure} <br/>
      <strong>Max Cool Points:</strong> {card_stats.non_idolized_maximum_statistics_cool} ~ {card_stats.idolized_maximum_statistics_cool} <br/>
    </Popover>
  );

  return (
    <div className="aidoru-buttons">
      <Button className="gacha-button" onClick={handleRerollGacha}>Re-roll</Button>
      <OverlayTrigger trigger="click" rootClose placement="top" overlay={gachaInfoOverlay}>
        <Button className="gacha-button">Stats</Button>
      </OverlayTrigger>
      <Button className="gacha-button" onClick={handleShareWaifu}>Share this waifu</Button>
    </div>
  );
};


export default GachaButtons;
