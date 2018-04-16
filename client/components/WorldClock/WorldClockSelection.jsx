'use strict';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { FormGroup, FormControl} from 'react-bootstrap';
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
      ["Asia/Tokyo", "Japan"],
      ["Asia/Hong_Kong", "Hong Kong"],
      ["Europe/London", "London"],
      ["Europe/Paris", "Paris"],
      ["Asia/Kolkata", "India"],
    ];
  }

  onSelectLocation(e) {
    if (e.target.value !== "None") {
      this.props.dispatch(changeTimezone(this.props.timezones, this.props.time_actives, this.props.selectIndex, e.target.value));
    } else {
      this.props.dispatch(clearTimezone(this.props.timezones, this.props.time_actives, this.props.selectIndex));
    }
  }

  render() {
    return (
        <form>
          <FormGroup>
            <FormControl
              className="clock-dropdown"
              componentClass="select"
              onChange={this.onSelectLocation}
            >
              {
                this.regions.map((region, i) => {
                  return (<option value={region[0]} key={i}>{region[1]}</option>);
                })
              }
            </FormControl>
          </FormGroup>
        </form>
    );
  }
}

WorldClockSelection.propTypes = {
  time_actives: PropTypes.arrayOf(PropTypes.bool).isRequired,
  timezones: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectIndex: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    time_actives: state.clock.time_actives,
    timezones: state.clock.timezones,
  };
}

export default connect(mapStateToProps)(WorldClockSelection);
