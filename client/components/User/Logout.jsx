'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout } from '../../actions/login_action_creators';

/**
 * Containing component under all routes for /user
 */
class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  render() {
    return (
      <div>
        <button className="btn btn-default" onClick={this.onLogoutClick}>Logout</button>
      </div>
    );
  }

  onLogoutClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch(logout());
  }
}

Login.propTypes = {};

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps
)(Login);
