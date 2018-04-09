'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { requestSlackToken } from '../../actions/login_action_creators';

class ConnectSlackContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleConnectSlack = this.handleConnectSlack.bind(this);
  }

  render() {
    return (
      <div>
        {this.props.requestedToken
          ? (
            <div>
              <h3>Get on slack and whisper this to @chuubot!</h3>
              <div className="well">{this.props.useCommand}</div>
            </div>
          )
          : <button onClick={this.handleConnectSlack} className="btn btn-primary">Connect Slack!</button>
        }
      </div>
    );
  }

  handleConnectSlack() {
    this.props.dispatch(requestSlackToken());
  }
}

ConnectSlackContainer.propTypes = {
  requestedToken: PropTypes.bool.isRequired,
  slackToken: PropTypes.string,
  useCommand: PropTypes.string,
};

ConnectSlackContainer.defaultProps = {
  slackToken: '',
  useCommand: '',
};


const mapStateToProps = (state, ownProps) => {
  return {
    requestedToken: !!state.user.slackToken,
    slackToken: state.user.slackToken,
    useCommand: state.user.useCommand,
  };
};
export default connect(mapStateToProps)(ConnectSlackContainer);
