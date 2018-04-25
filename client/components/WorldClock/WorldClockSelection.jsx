'use strict';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, FormControl, Button, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { changeTimezone, clearTimezone } from '../../modules/clock';

class WorldClockSelection extends PureComponent {
  constructor(props) {
    super(props);

    this.onSelectLocation = this.onSelectLocation.bind(this);

    this.regions = [
      ["None", "Choose your city/region here"],
      ["America/Los_Angeles", "San Francisco"],
      ["America/New_York", "New York"],
      ["Pacific/Honolulu", "Hawaii"],
      ["Asia/Tokyo", "Japan"],
      ["Asia/Hong_Kong", "Hong Kong"],
      ["Europe/London", "London"],
      ["Europe/Paris", "Paris"],
      ["Asia/Kolkata", "India"],
    ];
  }

  onSelectLocation(e) {
    if (e.target.value !== "None") {
      this.props.dispatch(changeTimezone(this.props.timezones, this.props.regions, this.props.time_actives, this.props.selectIndex, e.target.value, e.target.selectedOptions[0].innerText));
    } else {
      this.props.dispatch(clearTimezone(this.props.timezones, this.props.regions, this.props.time_actives, this.props.selectIndex));
    }
  }

  render() {
    return (
        <Form inline>
          <FormGroup>
            <FormControl
              className="clock-dropdown"
              componentClass="select"
              onChange={this.onSelectLocation}
              value={this.props.timezones[this.props.selectIndex]}
            >
              {
                this.regions.map((region, i) => {
                  return (<option value={region[0]} key={i}>{region[1]}</option>);
                })
              }
            </FormControl>
          </FormGroup>
          <Button bsStyle="danger" bsSize="small" onClick={() => this.props.deleteClock(this.props.selectIndex)}>
            <Glyphicon glyph="glyphicon glyphicon-remove"/>
          </Button>
        </Form>
    );
  }
}

WorldClockSelection.propTypes = {
  time_actives: PropTypes.arrayOf(PropTypes.bool).isRequired,
  timezones: PropTypes.arrayOf(PropTypes.string).isRequired,
  regions: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectIndex: PropTypes.number.isRequired,
  deleteClock: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    time_actives: state.clock.time_actives,
    timezones: state.clock.timezones,
    regions: state.clock.regions,
  };
}

export default connect(mapStateToProps)(WorldClockSelection);
