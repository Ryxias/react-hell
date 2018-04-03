'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Logout from './Logout.jsx';

class Dashboard extends PureComponent {
  render() {
    return (
      <div>
        <span>Hello, {this.props.username}!</span>
        <Logout/>
      </div>
    );
  }
}

Dashboard.propTypes = {
  username: PropTypes.string.isRequired,
};


function mapStateToProps(state) {
  return {
    username: state.user.user.username || state.user.user.email,
  };
}

export default connect(
  mapStateToProps
)(Dashboard);
