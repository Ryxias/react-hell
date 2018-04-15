'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { dismissAlert } from '../../modules/alert';

/**
 * Containing component for alert banners
 *
 * https://www.w3schools.com/bootstrap/bootstrap_alerts.asp
 */
class AlertContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.handleDismiss = this.handleDismiss.bind(this);
  }

  render() {
    const items = (() => {
      if (!this.props.hasAlert) {
        return null;
      }

      const alertSeverityClass = ((severity) => {
        switch (severity) {
          case 'success':
            return 'alert-success';
          case 'info':
            return 'alert-info';
          case 'warning':
            return 'alert-warning';
          case 'danger':
            return 'alert-danger';
        }
      })(this.props.severity);
      const classnames = `alert ${alertSeverityClass}`;

      return (
        <CSSTransition
          key={"the-alert"}
          classNames="alert"
          timeout={{ enter: 500, exit: 300 }}>

          <div className={classnames}>
            <p>
              {this.props.message}
              <a href="#" className="close" onClick={this.handleDismiss} aria-label="close">&times;</a>
            </p>
          </div>
        </CSSTransition>
      );
    })();

    return (
      <TransitionGroup>
        {items}
      </TransitionGroup>
    );
  }

  componentDidUpdate() {
    if (this.alert_automatic_timeout) {
      clearTimeout(this.alert_automatic_timeout);
    }

    if (this.props.hasAlert) {
      this.alert_automatic_timeout = setTimeout(() => {
        this.props.dispatch(dismissAlert());
      }, 4000); // after 4 seconds dismiss it the alert banner anyway
    }
  }

  componentWillUnmount() {
    if (this.alert_automatic_timeout) {
      clearTimeout(this.alert_automatic_timeout);
    }
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
