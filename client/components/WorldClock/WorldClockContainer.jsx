import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WorldClockDisplay from './WorldClockDisplay.jsx';

class WorldClockContainer extends PureComponent {
  render() {
    return (
      <div>
        <WorldClockDisplay/>
      </div>
    );
  }
}

WorldClockContainer.propTypes = {
  location: PropTypes.string,
};

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps)(WorldClockContainer);
