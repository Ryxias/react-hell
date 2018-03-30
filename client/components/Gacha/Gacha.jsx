import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import GachaContent from './GachaContent.jsx';
import actionCreators from '../../actions/gacha_action_creators';

class Gacha extends PureComponent {
  constructor(props) {
    super(props);

    this.resetGacha = this.resetGacha.bind(this);
    this.getGacha = this.getGacha.bind(this);
    this.enableGachaAnimation = this.enableGachaAnimation.bind(this);
  }

  // Resets game state to default states; open_sound has to be pre-populated
  // with a filler value for the data-attribute to work properly
  resetGacha() {
    this.props.dispatch(actionCreators.resetGacha());
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

    this.props.dispatch(actionCreators.startGachaRoll());
  }

  // Put an onclick listener on the close envelope that replaces it
  // with the open envelope, which then animates itself to grow fat as fuck
  // before exploding in disappointment for all you gacha fools

  enableGachaAnimation() {
    const $closed_envelope = $(".envelope-closed");
    const $open_envelope = $(".envelope-open");
    let $data_blob = $(".data");
    $data_blob.data("open-sound-url", "/statics/sound/" + this.props.card.open_sound);
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
        <GachaContent card={this.props.card} getGacha={this.getGacha} />
      </div>
    );
  }
}

Gacha.propTypes = {
  card: PropTypes.object.isRequired,
};
Gacha.defaultProps = {
  card: {},
};

const mapStateToProps = (state, ownProps) => {

  console.log(state); // see the whole redux state everything EVERYTHING

  // gets set into "this.props"
  return {
    card: state.gacha.card,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return { dispatch };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Gacha));
