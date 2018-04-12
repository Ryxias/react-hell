'use strict';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import WorldClockDisplay from './WorldClockDisplay.jsx';
import WorldClockSelection from './WorldClockSelection.jsx';
import WorldClockButtons from './WorldClockButtons.jsx';
import { Row, Col } from 'react-bootstrap';
import { addTimezone } from '../../actions/clock_action_creators';

class WorldClockContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.ticker = null;
    this.state = {
      unixtimestamp: Date.now(), // set up initial unix timestamp
    };
    this.addClock = this.addClock.bind(this);
  }

  addClock() {
    this.props.dispatch(addTimezone(this.props.timezones, this.props.time_actives, null));
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
    // const clockProps = {
    //   unixtimestamp: this.state.unixtimestamp,
    //   timezone: this.props.timezone,
    // };
    return (
      <div>
        <h1>World Clock</h1>
        <WorldClockButtons addClock={this.addClock}/>
        <Col>
          {/*<WorldClockSelection/>*/}
          {/*{ this.props.time_active ? <WorldClockDisplay {...clockProps} /> : null } // []*/}
          { this.props.timezones.map((timezone, index) => {
            const clockProps = {
              unixtimestamp: this.state.unixtimestamp,
              timezone: timezone,
              index: index,
            };
            return this.props.time_actives[index] ?
              [<WorldClockSelection key={index} selectIndex={index}/>, <WorldClockDisplay {...clockProps}/>]
              : <WorldClockSelection key={index}/>;
          }) }
        </Col>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    time_actives: state.clock.time_actives,
    timezones: state.clock.timezones,
  };
}

export default connect(mapStateToProps)(WorldClockContainer);
