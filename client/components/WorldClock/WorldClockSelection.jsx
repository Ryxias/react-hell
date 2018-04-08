import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Navbar, FormGroup, FormControl} from 'react-bootstrap';;

import { changeTimezone } from '../../actions/clock_action_creators'

class WorldClockSelection extends PureComponent {
  constructor(props) {
    super(props);

    this.onSelectLocation = this.onSelectLocation.bind(this);
  }

  onSelectLocation(e) {
    this.props.dispatch(changeTimezone(e.target.value));
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
              <option value={-7}>San Francisco</option>
              <option value={-4}>New York</option>
              <option value={9}>Japan</option>
              <option value={8}>Hong Kong</option>
              <option value={1}>London</option>
              <option value={2}>France</option>
              <option value={5.5}>India</option>
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
