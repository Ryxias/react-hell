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
      envelope_image_closed: "loading.gif",
      envelope_image_open: "",
      open_sound: "r_open.mp3"
    };

    this.resetGacha = this.resetGacha.bind(this);
    this.getGacha = this.getGacha.bind(this);
    this.enableGachaAnimation = this.enableGachaAnimation.bind(this);
  }

  resetGacha() {
    this.setState({
      ard_title: "",
      card_ext_link: "",
      card_image_url: "",
      rarity: "",
      envelope_image_closed: "loading.gif",
      envelope_image_open: "",
      open_sound: "r_open.mp3"
    });
  }

  getGacha() {
    this.resetGacha();

    const $opened_card_container = $(".opened-card-container");
    const $envelope_image_container = $(".envelope-image-container");
    const $closed_envelope = $(".envelope-closed");
    const $open_envelope = $(".envelope-open");

    if (!$opened_card_container.hasClass("hide")) {
      $opened_card_container.addClass("hide");
    }

    if ($envelope_image_container.hasClass("hide")) {
      $envelope_image_container.removeClass("hide");
      $closed_envelope.removeClass("hide");
      $open_envelope.addClass("hide");
    }

    axios.get("/api/sif/roll")
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

  // Put an onclick listener on the close envelope that replaces it
  // with the open envelope, which then animates itself to grow fat as fuck
  // before exploding in disappointment for all you gacha fools

  enableGachaAnimation() {
    const $closed_envelope = $(".envelope-closed");
    const $open_envelope = $(".envelope-open");
    let $data_blob = $(".data");
    $data_blob.data("open-sound-url", "/statics/sound/" + this.state.open_sound);
    let audio = new Audio($data_blob.data("open-sound-url"));

    const animateOpeningBox = () => {
      // Replace the closed envelope with the open one
      $closed_envelope.addClass("hide");
      $open_envelope.removeClass("hide");

      // Do some stupid ass animation of the open envelope
      $open_envelope.animate({width:'275px'}, 450, () => {
        //do stuff after animation
        $(".envelope-image-container").addClass("hide");
        let $container = $(".opened-card-container");
        $container.css("display", "none").removeClass("hide");
        $container.stop().fadeIn("slow");
      });
    };

    // Play kinky music
    //   Putting the animation crap in here ensures the audio begins to play before
    //   the animations, making the UI "feel" more snappy.

    $closed_envelope.off().on("click", () => {
      audio.play().then(animateOpeningBox);
    });
  }

  componentWillMount() {
    this.getGacha();
  }

  componentDidUpdate() {
    this.enableGachaAnimation();
  }

  render() {
    return (
      <div className="gacha-container">
        <div className="envelope-image-container">
          <img className="envelope-image envelope-closed" src={"/statics/i/" + this.state.envelope_image_closed} />
          <img className="envelope-image envelope-open hide" src={"/statics/i/" + this.state.envelope_image_open} />
        </div>
        <div className="opened-card-container hide">
          <span className="aidoru-name">
            <a href={this.state.card_ext_link}>{this.state.card_title}</a>
          </span>
          <img className="aidoru-image" src={this.state.card_image_url}/>
          <div className="aidoru-buttons">
            <button className="btn gacha-button" onClick={this.getGacha}>Re-roll</button>
            <button className="btn gacha-button">Share this waifu</button>
          </div>
        </div>
        <div className="data" data-open-sound-url={"/statics/sound/" + this.state.open_sound}></div>
      </div>
    );
  }
}

export default Gacha;
