'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


class GossipAppContainer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Stuff goes here?
      </div>
    );
  }
}

GossipAppContainer.propTypes = {

};

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps)(GossipAppContainer);
