'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { requestSlackToken, dismissSlackToken } from '../../modules/auth';

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
              <p>
                This features connects your Slack user to your chuuni.me User, and also
                teaches chuubot to associate the private messaging session with your Slack
                user.
              </p>
              <p>
                By typing <code>!connect-me test</code> in any channel, chuubot will whisper
                you in that private messaging session.
              </p>
              <p>
                This isn't currently being used for anything... but just you wait!
              </p>
            </div>
          )
          : <button onClick={this.handleConnectSlack} className="btn btn-primary">Connect Slack!</button>
        }
      </div>
    );
  }

  componentWillUnmount() {
    this.props.dispatch(dismissSlackToken());
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
