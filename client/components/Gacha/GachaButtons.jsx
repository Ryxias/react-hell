import React from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

const GachaButtons = ({ handleRerollGacha, handleShareWaifu, card_stats }) => {

  const stats = card_stats ? card_stats : {
    name: "",
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

  const gachaInfoOverlay = (
    <Popover id="popover-trigger-click" title="Card Statistics">
      <strong>Name:</strong> {stats.name} <br/>
      <strong>Attribute:</strong> {stats.attribute} <br/>
      <strong>Skill: [{stats.skill}]</strong> {stats.skill_details} <br/>
      <strong>Center Skill: [{stats.center_skill}]</strong> {stats.center_skill_details} <br/>
      <strong>Max Smile Points:</strong> {stats.non_idolized_maximum_statistics_smile} ~ {stats.idolized_maximum_statistics_smile} <br/>
      <strong>Max Pure Points:</strong> {stats.non_idolized_maximum_statistics_pure} ~ {stats.idolized_maximum_statistics_pure} <br/>
      <strong>Max Cool Points:</strong> {stats.non_idolized_maximum_statistics_cool} ~ {stats.idolized_maximum_statistics_cool} <br/>
    </Popover>
  );

  return (
    <div className="aidoru-buttons">
      <Button className="gacha-button" onClick={handleRerollGacha}>Re-roll</Button>
      <OverlayTrigger trigger="click" placement="top" overlay={gachaInfoOverlay}>
        <Button className="gacha-button">Stats</Button>
      </OverlayTrigger>
      <Button className="gacha-button" onClick={handleShareWaifu}>Share this waifu</Button>
    </div>
  );
};


export default GachaButtons;
