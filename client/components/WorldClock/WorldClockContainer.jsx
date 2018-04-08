import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import WorldClockDisplay from './WorldClockDisplay.jsx';
import WorldClockSelection from './WorldClockSelection.jsx';
import { Nav, NavItem } from 'react-bootstrap';

class WorldClockContainer extends PureComponent {
  render() {
    return (
      <Nav pullRight>
          { this.props.time_active ? <WorldClockDisplay/> : null }
          <WorldClockSelection/>
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
