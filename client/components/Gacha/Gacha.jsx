import React, { Component } from 'react';
import axios from 'axios';

class Gacha extends Component {
  constructor(props) {
    super(props);

    this.state = {
      card_title: "",
      card_ext_link: "",
      card_image_url: "",
      rarity: "",
      envelope_image_closed: "envelope_r1.png",
      envelope_image_open: "envelope_r2.png",
      open_sound: ""
    };

    this.getGacha = this.getGacha.bind(this);
  }

  getGacha() {
    axios.get("/react/sif/roll")
      .then((received) => {
      console.log('Received data:', received.data);
      this.setState({
        card_title: received.data.card_title,
        card_ext_link: received.data.card_ext_link,
        card_image_url: received.data.card_image_url,
        rarity: received.data.rarity,
        envelope_image_closed: received.data.envelope_image_closed,
        envelope_image_open: received.data.envelope_image_open,
        open_sound: received.data.open_sound
      });
    });
  }

  componentWillMount() {
    this.getGacha();
  }

  render() {
    return (
      <div className="gacha-container">
        <div className="envelope-image-container">
          <img className="envelope-image envelope-closed" src={"/public_react/assets/i/" + this.state.envelope_image_closed} />
          <img className="envelope-image envelope-open hide" src={"/public_react/assets/i/" + this.state.envelope_image_open} />
        </div>
        <div className="opened-card-container hide">
        <span className="aidoru-name">
          <a href={this.state.card_ext_link}>{this.state.card_title}</a>
          </span>
          <img className="aidoru-image" src={this.state.card_image_url}/>
        </div>
        <div className="data" data-open-sound-url={"/public_react/assets/sound/" + this.state.open_sound}></div>
      </div>
    );
  }
}

export default Gacha;