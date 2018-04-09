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
      this.props.dispatch(changeTimezone(e.target.value));
    } else {
      this.props.dispatch(clearTimezoneText());
    }
  }

  render() {
    return (
        <Navbar.Form pullRight>
          <FormGroup>
            <FormControl
              className="nav-dropdown"
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
              <option value={"India/Delhi"}>India</option>
            </FormControl>
          </FormGroup>
        </Navbar.Form>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(WorldClockSelection);
