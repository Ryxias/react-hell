import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class WorldClockDisplay extends PureComponent {
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
