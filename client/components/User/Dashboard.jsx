'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Logout from './Logout.jsx';
import ConnectSlackContainer from './ConnectSlackContainer.jsx';

class Dashboard extends PureComponent {
  render() {
    return (
      <div>
        <section>
          <h1>{this.props.username}'s Dashboard</h1>
        </section>
        <section>
          <ConnectSlackContainer/>
        </section>
        <section>
          <Logout/>
        </section>
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
