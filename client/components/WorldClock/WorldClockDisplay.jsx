import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class WorldClockDisplay extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>Clock goes here</p>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        offset: state.clockReducer.offset,
    };
}

export default connect(mapStateToProps)(WorldClockDisplay);
