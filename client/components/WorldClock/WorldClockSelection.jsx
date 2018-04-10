'use strict';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Navbar, FormGroup, FormControl} from 'react-bootstrap';

import { changeTimezone, clearTimezoneText } from '../../actions/clock_action_creators';

class WorldClockSelection extends PureComponent {
  constructor(props) {
    super(props);

    this.onSelectLocation = this.onSelectLocation.bind(this);
  }

  onSelectLocation(e) {
    if (e.target.value !== null) {
      console.log('what is this.props.selectIndex in onselectlocation?', this.props.selectIndex);
      this.props.dispatch(changeTimezone(this.props.timezones, this.props.time_actives, this.props.selectIndex, e.target.value));
    } else {
      this.props.dispatch(clearTimezoneText(this.props.selectIndex));
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
              <option value={null}>Choose your city/region here</option>
              <option value={"America/Los_Angeles"}>San Francisco</option>
              <option value={"America/New_York"}>New York</option>
              <option value={"Asia/Tokyo"}>Japan</option>
              <option value={"Asia/Hong_Kong"}>Hong Kong</option>
              <option value={"Europe/London"}>London</option>
              <option value={"Europe/Paris"}>Paris</option>
              <option value={"Asia/Kolkata"}>India</option>
            </FormControl>
          </FormGroup>
        </form>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    selectIndex: 0,
    time_actives: state.clock.time_actives,
    timezones: state.clock.timezones,
  };
}

export default connect(mapStateToProps)(WorldClockSelection);
