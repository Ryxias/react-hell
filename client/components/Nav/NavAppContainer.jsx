'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NavTop from './NavTop.jsx';

import { synchronizeLoginState } from '../../modules/auth';

/**
 * Containing component for the header navbar
 */
class NavTopContainer extends PureComponent {
  render() {
    const props = {
      userAppText: this.props.isLoggedIn ? this.props.username : 'Login',
    };
    return (
      <NavTop {...props} />
    );
  }

  /**
   * On first mount, we make a stateful API call to see if the user is currently logged in
   */
  componentDidMount() {
    // Synchronize right away
    this.props.synchronizeLoginState();

    // Set up recurring synchronization as long as the window is alive
    this.ticker = setInterval(() => {
      // FIXME (derek) this seems kinda hacky?
      if (document.hasFocus()) {
        this.props.synchronizeLoginState();
      } else {
        //console.log('Not synchronizing; not focused');
      }
    // Check to synchronize once every 5 minutes
    }, 5 * 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
  }
}

NavTopContainer.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
};


function mapStateToProps(state) {
  const auth = state.auth;

  return {
    isLoggedIn: !!(auth && auth.user && auth.user.id),
    username: auth && auth.user && (auth.user.username || auth.user.email),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    synchronizeLoginState: () => dispatch(synchronizeLoginState()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavTopContainer);
