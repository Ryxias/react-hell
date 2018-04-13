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
  return {
    isLoggedIn: !!(state.user && state.user.user && state.user.user.id),
    username: state.user && state.user.user && (state.user.user.username || state.user.user.email),
  };
}

export default connect(
  mapStateToProps
)(NavTopContainer);
