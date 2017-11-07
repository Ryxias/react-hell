import React, { Component } from 'react';
import axios from 'axios';

import GachaContent from './GachaContent.jsx';

class Gacha extends Component {
  constructor(props) {
    super(props);

    this.state = {
      card_title: "",
      card_ext_link: "",
      card_image_url: "",
      rarity: "",
      envelope_image_closed: "",
      envelope_image_open: "",
      open_sound: "",
      envelopeIsOpened: false
    };

    this.resetGacha = this.resetGacha.bind(this);
    this.getGacha = this.getGacha.bind(this);
    this.enableGachaAnimation = this.enableGachaAnimation.bind(this);
    this.openEnvelope = this.openEnvelope.bind(this);
    this.enableSound = this.enableSound.bind(this);
  }

  // Resets game state to default states; open_sound has to be pre-populated
  // with a filler value for the data-attribute to work properly

  resetGacha() {
    this.setState({
      card_title: "",
      card_ext_link: "",
      card_image_url: "",
      rarity: "",
      envelope_image_closed: "loading.gif",
      envelope_image_open: "",
      open_sound: "r_open.mp3",
      envelopeIsOpened: false
    });
  }

  // GETS a random gacha from schoolido.lu's LLSIF API and replaces
  // the states with the obtained data

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

    const animateOpeningBox = () => {
      // Replace the closed envelope with the open one
      $closed_envelope.removeClass("reveal");
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
      animateOpeningBox();
    });
  }

  // Triggers envelopeIsOpened state upon clicking a closed envelope

  openEnvelope() {
    console.log('Opening envelope...');
    this.setState({
      envelopeIsOpened: true,
    });
    this.enableSound().play();
  }

  // Creates audio object from new sound URL

  enableSound() {
    const soundElement = document.getElementsByClassName("data")[0];
    soundElement.setAttribute("data-open-sound-url", "/statics/sound/" + this.state.open_sound);
    const soundData = soundElement.getAttribute("data-open-sound-url");
    return new Audio(soundData);
  }

  // Retrieves data before presentation of the virtual DOM

  componentWillMount() {
    this.getGacha();
  }

  // Attaches the jQuery events once the virtual DOM has been fully mounted and onClick event has been triggered

  componentDidUpdate() {
    this.enableGachaAnimation();
  }

  render() {
    return (
      <div>
        <GachaContent gameState={this.state} getGacha={this.getGacha} openEnvelope={this.openEnvelope} />
      </div>
    );
  }
}

export default Gacha;
