import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavDropdown, DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { changeLocation } from '../../actions/clock_action_creators'

class WorldClockSelection extends PureComponent {
  constructor(props) {
    super(props);

    this.onSelectLocation = this.onSelectLocation.bind(this);
  }

  onSelectLocation(eventKey = 'San Francisco') {
    this.props.dispatch(changeLocation(eventKey));
    console.log('What is this.props now?', this.props);
  }

  render() {
    return (
      <div>
        <NavDropdown
          eventKey="5"
          title={this.props.location}
          id="clock-list"
          className="nav-link"
          onSelect={this.onSelectLocation}
        >
          <MenuItem eventKey="San Francisco">San Francisco</MenuItem>
          <MenuItem eventKey="New York">New York</MenuItem>
          <MenuItem eventKey="Japan">Japan</MenuItem>
          <MenuItem eventKey="Hong Kong">Hong Kong</MenuItem>
          <MenuItem eventKey="United Kingdom">United Kingdom</MenuItem>
          <MenuItem eventKey="France">France</MenuItem>
          <MenuItem eventKey="India">India</MenuItem>
          <MenuItem eventKey="Philippines">Philippines</MenuItem>
          <MenuItem eventKey="Malaysia">Malaysia</MenuItem>
        </NavDropdown>
      </div>
    );
  }
}

WorldClockSelection.propTypes = {
  location: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    location: state.clockReducer.location,
  };
}

export default connect(mapStateToProps)(WorldClockSelection);
