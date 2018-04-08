import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class WorldClockDisplay extends PureComponent {
    constructor(props) {
        super(props);

        this.worldClock = this.worldClock.bind(this);
    }

    worldClock() {
        let time = new Date();  // local time object
        let offset = time.getTimezoneOffset()/60; // UTC offset from local time
        let seconds = time.getSeconds();
        let minutes = time.getMinutes();
        let hours =
    }

    render() {
        return (
            <div>
                <p>Clock goes here</p>
            </div>
        );
    }
}

WorldClockDisplay.propTypes = {
    hour: PropTypes.number.isRequired,
    minute: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
    return {

    };
}

export default connect(mapStateToProps)(WorldClockDisplay);
