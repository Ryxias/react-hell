'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import GossipIndex from './GossipIndex.jsx';

class GossipAppContainer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GossipIndex/>
    );
  }
}

GossipAppContainer.propTypes = {

};

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps)(GossipAppContainer);
