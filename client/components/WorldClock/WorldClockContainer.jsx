'use strict';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import WorldClockDisplay from './WorldClockDisplay.jsx';
import WorldClockSelection from './WorldClockSelection.jsx';
import WorldClockButtons from './WorldClockButtons.jsx';
import { Col, Clearfix } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { addTimezone, deleteTimezone } from '../../modules/clock';

export class WorldClockContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.ticker = null;
    this.state = {
      unixtimestamp: Date.now(), // set up initial unix timestamp
    };
    this.addClock = this.addClock.bind(this);
    this.deleteClock = this.deleteClock.bind(this);
  }

  addClock() {
    this.props.dispatch(addTimezone(this.props.timezones, this.props.regions, this.props.time_actives));
  }

  deleteClock(index) {
    this.props.dispatch(deleteTimezone(this.props.timezones, this.props.regions, this.props.time_actives, index));
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
    return (
      <div>
        <h1>World Clock</h1>
        <WorldClockButtons addClock={this.addClock}/>
        { this.props.timezones.map((timezone, index) => {
          const clockProps = {
            unixtimestamp: this.state.unixtimestamp,
            timezone: timezone,
            region: this.props.regions[index],
            index: index,
          };
          return this.props.time_actives[index]
            ? (
                <Col xs={7} md={7} lg={7}>
                  <div className="world-clock animated fadeInDown" key={index}>
                    <WorldClockSelection selectIndex={index} deleteClock={this.deleteClock}/>
                    <WorldClockDisplay {...clockProps}/>
                  </div>
                </Col>
            )
            : (
              <Col xs={7} md={7} lg={7}>
                <div className="world-clock animated fadeInDown" key={index}>
                  <WorldClockSelection selectIndex={index} deleteClock={this.deleteClock}/>
                </div>
              </Col>
            );
        }) }
      </div>
    );
  }
}

WorldClockContainer.propTypes = {
  time_actives: PropTypes.arrayOf(PropTypes.bool).isRequired,
  timezones: PropTypes.arrayOf(PropTypes.string).isRequired,
  regions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function mapStateToProps(state) {
  return {
    time_actives: state.clock.time_actives,
    timezones: state.clock.timezones,
    regions: state.clock.regions,
  };
}

export default connect(mapStateToProps)(WorldClockContainer);
