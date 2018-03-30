'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

class User extends PureComponent {
  render() {
    return (
      <div>
        <span>Hello my username is {this.props.username}!</span>
      </div>
    );
  }
}

User.propTypes = {
  username: PropTypes.string.isRequired,
};


function mapStateToProps(state) {
  return {
    username: 'sunsilverdragon',
  };
}

export default connect(
  mapStateToProps
)(User)
