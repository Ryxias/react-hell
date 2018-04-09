'use strict';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import WorldClockDisplay from './WorldClockDisplay.jsx';
import WorldClockSelection from './WorldClockSelection.jsx';
import WorldClockButtons from './WorldClockButtons.jsx';
import { Row, Col } from 'react-bootstrap';

class WorldClockContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.ticker = null;
    this.state = {
      unixtimestamp: Date.now(), // set up initial unix timestamp
    };
  }

  componentDidMount() {
    this.ticker = setInterval(() => {
      this.setState({ unixtimestamp: Date.now() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
  }

  render() {
    const clockProps = {
      unixtimestamp: this.state.unixtimestamp,
      timezone: this.props.timezone,
    };
    return (
      <div>
        <h1>World Clock</h1>
        <WorldClockButtons/>
        <Col>
          <WorldClockSelection/>
          { this.props.time_active ? <WorldClockDisplay {...clockProps} /> : null }
        </Col>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    time_active: state.clock.time_active,
    timezone: state.clock.timezone,
  };
}

export default connect(mapStateToProps)(WorldClockContainer);
