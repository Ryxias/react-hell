import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import WorldClockDisplay from './WorldClockDisplay.jsx';
import WorldClockSelection from './WorldClockSelection.jsx';
import { Nav } from 'react-bootstrap';

class WorldClockContainer extends PureComponent {
  render() {
    return (
      <Nav pullRight>
        <WorldClockSelection/>
        { this.props.time_active ? <WorldClockDisplay/> : null }
      </Nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    time_active: state.clockReducer.time_active,
  };
}

export default connect(mapStateToProps)(WorldClockContainer);
