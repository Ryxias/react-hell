'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Alert, Fade } from 'react-bootstrap';

import { dismissAlert } from '../../actions/alert_action_creators';

/**
 * Containing component for alert banners
 *
 * https://www.w3schools.com/bootstrap/bootstrap_alerts.asp
 */
class AlertContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.handleDismiss = this.handleDismiss.bind(this);
    this.startFadeout = this.startFadeout.bind(this);

    this.state = { fading: true };
  }

  render() {
    if (!this.props.hasAlert) {
      return null;
    }

    // One way of doing it... without react-bootstrap
    // const alertSeverityClass = ((severity) => {
    //   switch (severity) {
    //     case 'success':
    //       return 'alert-success';
    //     case 'info':
    //       return 'alert-info';
    //     case 'warning':
    //       return 'alert-warning';
    //     case 'danger':
    //       return 'alert-danger';
    //   }
    // })(this.props.severity);
    //
    // const classNames = `alert ${alertSeverityClass} alert-dismissible fade in`;
    // return (
    //   <div className={classNames}>
    //     <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
    //     {this.props.message}
    //   </div>
    // );

    // Another way of doing this, using the react-bootstrap Alert component
    //
    // This way is annoying because it's really hard to get the Fade to work properly.
    //

    // onExited={this.handleDismiss} why doesnt that work?
    return (
      <Fade in={this.state.fading}>
        <Alert bsStyle={this.props.severity} onDismiss={this.startFadeout}>
          {/*<h4>Oh snap!</h4>*/}
          <p>
            {this.props.message}
          </p>
        </Alert>
      </Fade>
    );
  }

  startFadeout() {
    this.setState({ fading: false });
  }

  handleDismiss(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch(dismissAlert());
  }
}

AlertContainer.propTypes = {
  hasAlert: PropTypes.bool.isRequired,
  message: PropTypes.string,
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'danger']),
};
AlertContainer.defaultProps = {
  message: 'Some message is supposed to go here, but our guy forgot to fill it out',
  severity: 'info',
};


function mapStateToProps(state) {
  return {
    hasAlert: !!state.alert.hasAlert,
    message: state.alert.message,
    severity: state.alert.severity,
  };
}

export default connect(
  mapStateToProps
)(AlertContainer);
