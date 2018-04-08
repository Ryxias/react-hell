import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navbar } from 'react-bootstrap';

class WorldClockDisplay extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navbar.Text pullRight>
                Time is now {this.props.hour}:{this.props.minute}:{this.props.second} {this.props.meridian}
            </Navbar.Text>
        );
    }
}

function mapStateToProps(state) {
    return {
        hour: state.clockReducer.hour,
        minute: state.clockReducer.minute,
        second: state.clockReducer.second,
        meridian: state.clockReducer.meridian,
    };
}

export default connect(mapStateToProps)(WorldClockDisplay);
