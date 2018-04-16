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
    this.props.dispatch(synchronizeLoginState());
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
  mapStateToProps
)(NavTopContainer);
