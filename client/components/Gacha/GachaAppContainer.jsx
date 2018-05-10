import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import GachaContent from './GachaContent.jsx';
import GachaLoadingScreen from './GachaLoadingScreen.jsx';
import { resetGacha, startGachaRoll, shareCard } from '../../modules/gacha';

export class GachaAppContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      animationPhase: 'closed',
      idolized: false,
    };

    this.handleRerollGacha = this.handleRerollGacha.bind(this);
    this.handleShareWaifu = this.handleShareWaifu.bind(this);
    this.handleEnvelopeOpen = this.handleEnvelopeOpen.bind(this);
    this.handleIdolCardClick = this.handleIdolCardClick.bind(this);
  }

  // Resets game state to default states; open_sound has to be pre-populated
  // with a filler value for the data-attribute to work properly
  resetGacha() {
    this.setState({ animationPhase: 'closed', idolized: false });
    // this.props.dispatch(resetGacha());
    this.props.resetGacha();
  }

  // GETS a random gacha from schoolido.lu's LLSIF API and replaces
  // the states with the obtained data
  getGacha() {
    this.resetGacha();
    // this.props.dispatch(startGachaRoll());
    this.props.startGachaRoll();
  }

  handleRerollGacha() {
    this.getGacha();
  }

  handleShareWaifu() {
    if (this.props.card.id) {
      // this.props.dispatch(shareCard(this.props.card.id, this.state.idolized));
      this.props.shareCard(this.props.card.id, this.state.idolized);
    }
  }

  handleEnvelopeOpen() {
      return this.state.animationPhase === 'closed'? this.props.card.open_sound.play()
        .then(() => {
          this.setState({
            animationPhase: 'opening',
          });

          // FIXME (derek) right now we align this perfectly with the animation
          // speed in the GachaContent component, but in the future we should use
          // the transition group events to fire this as a callback.
          setTimeout((() => this.setState({ animationPhase: 'open_finished' })), 450);
        }) : false;
  }

  handleIdolCardClick() {
    if (!!this.props.card.card_idolized_image_url
      && this.props.card.card_idolized_image_url !== this.props.card.card_image_url) {
      this.setState({ idolized: !this.state.idolized });
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
      handleIdolCardClick: this.handleIdolCardClick,
      animationPhase: this.state.animationPhase,
      idolized: this.state.idolized,
    };
    return (
      <div>
        <link rel="stylesheet" href="/statics/css/sif.css"/>
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

const mapStateToProps = (state) => {
  return {
    card: state.gacha.card,
    isLoading: !!state.gacha.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GachaAppContainer));

export default withRouter(connect(mapStateToProps, { resetGacha, startGachaRoll, shareCard })(GachaAppContainer));
