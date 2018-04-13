'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout } from '../../modules/auth';

/**
 * Containing component under all routes for /user
 */
class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  render() {
    const classes = [ 'btn', 'btn-default' ];
    if (this.props.isLoggingOut) {
      classes.push('disabled');
    }
    return (
      <div>
        <button className={classes.join(' ')} onClick={this.onLogoutClick}>Logout</button>
      </div>
    );
  }

  onLogoutClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch(logout());
  }
}

Login.propTypes = {
  isLoggingOut: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    isLoggingOut: !!state.user.isLoggingOut,
  };
}

export default connect(
  mapStateToProps
)(Login);
