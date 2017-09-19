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
      open_sound: "r_open.mp3"
    };

    this.getGacha = this.getGacha.bind(this);
    this.enableGachaAnimation = this.enableGachaAnimation.bind(this);
  }

  getGacha() {
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
    const $data_blob = $(".data");
    const audio = new Audio($data_blob.data("open-sound-url"));

    const animateOpeningBox = () => {
      // Replace the closed envelope with the open one
      $closed_envelope.addClass("hide");
      $open_envelope.removeClass("hide");

      // Do some stupid ass animation of the open envelope
      $open_envelope.animate({width:'275px'}, 450, () => {
        //do stuff after animation
        $(".envelope-image-container").remove();
        let $container = $(".opened-card-container");
        $container.css("display", "none").removeClass("hide");
        $container.fadeIn("slow");
      });
    };

    $closed_envelope.on("click", () => {
      // Play kinky music
      //   Putting the animation crap in here ensures the audio begins to play before
      //   the animations, making the UI "feel" more snappy.
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
        </div>
        <div className="data" data-open-sound-url={"/statics/sound/" + this.state.open_sound}></div>
      </div>
    );
  }
}

export default Gacha;
