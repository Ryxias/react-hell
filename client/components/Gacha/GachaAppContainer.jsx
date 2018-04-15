import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import GachaContent from './GachaContent.jsx';
import GachaLoadingScreen from './GachaLoadingScreen.jsx';
import { resetGacha, startGachaRoll, shareCard } from '../../modules/gacha';

class GachaAppContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      animationPhase: 'closed',
    };

    this.handleShareWaifu = this.handleShareWaifu.bind(this);
    this.handleEnvelopeOpen = this.handleEnvelopeOpen.bind(this);
    this.handleRerollGacha = this.handleRerollGacha.bind(this);
  }

  // Resets game state to default states; open_sound has to be pre-populated
  // with a filler value for the data-attribute to work properly
  resetGacha() {
    this.setState({ animationPhase: 'closed' });
    this.props.dispatch(resetGacha());
  }

  // GETS a random gacha from schoolido.lu's LLSIF API and replaces
  // the states with the obtained data
  getGacha() {
    this.resetGacha();
    this.props.dispatch(startGachaRoll());
  }

  handleRerollGacha() {
    this.getGacha();
  }

  handleShareWaifu() {
    if (this.props.card.id) {
      this.props.dispatch(shareCard(this.props.card.id));
    }
  }

  handleEnvelopeOpen() {
    if (this.state.animationPhase === 'closed') {
      const audio = new Audio('/statics/sound/' + this.props.card.open_sound);

      // Play kinky music
      //   Putting the animation crap in here ensures the audio begins to play before
      //   the animations, making the UI "feel" more snappy.
      return audio.play()
        .then(() => {
          this.setState({
            animationPhase: 'opening',
          });

          // FIXME (derek) right now we align this perfectly with the animation
          // speed in the GachaContent component, but in the future we should use
          // the transition group events to fire this as a callback.
          setTimeout((() => this.setState({ animationPhase: 'open_finished' })), 450);
        });
    }
  }

  // Retrieves data before presentation of the virtual DOM

  componentWillMount() {
    this.getGacha();
  }

  render() {
    const contentProps = {
      card: this.props.card,
      handleRerollGacha: this.handleRerollGacha,
      handleShareWaifu: this.handleShareWaifu,
      handleEnvelopeOpen: this.handleEnvelopeOpen,
      animationPhase: this.state.animationPhase,
    };
    return (
      <div>
        { this.props.isLoading
          ? <GachaLoadingScreen />
          : <GachaContent {...contentProps} />
        }
      </div>
    );
  }
}

GachaAppContainer.propTypes = {
  card: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
GachaAppContainer.defaultProps = {
  card: {},
};

const mapStateToProps = (state, ownProps) => {
  return {
    card: state.gacha.card,
    isLoading: !!state.gacha.loading,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return { dispatch };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GachaAppContainer));
