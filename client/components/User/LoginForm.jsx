'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * The name is a bit misleading as this component is good for anything that
 * accepts a username/password input with a submit button type thing
 *
 * (such as registration or login)
 */
const LoginForm = props => {
  const { onClick, buttonText, emailRef, passwordRef, disableLastpass, isSubmitting } = props;

  // Note: the lastpass disable doesnt seem to work consistently
  // https://stackoverflow.com/questions/20954944/stop-lastpass-filling-out-a-form

  const classes = [ 'btn', 'btn-default' ];
  if (isSubmitting) {
    classes.push('disabled');
  }

  return (
    <form className="container-fluid" autoComplete={disableLastpass ? 'off' : 'on'} data-lpignore={disableLastpass}>
      <div className="form-group">
        <input className="form-control"
               type="email"
               ref={emailRef}
               name="email"
               placeholder="Username"
               data-lpignore={disableLastpass}
        />
        <input className="form-control"
               type="password"
               ref={passwordRef}
               name="password"
               placeholder="Password"
               data-lpignore={disableLastpass}
        />
        <button onClick={onClick} className={classes.join(' ')}>{buttonText}</button>
      </div>
    </form>
  );
};

LoginForm.propTypes = {
  /**
   * Callback function fired when the submit button is clicked
   */
  onClick: PropTypes.func.isRequired,

  /**
   * Text to display on the submit button
   */
  buttonText: PropTypes.string,

  /**
   * A React ref-attaching function
   */
  emailRef: PropTypes.func,
  passwordRef: PropTypes.func,

  /**
   * Boolean; pass true to -attempt- to disable lastpass. False otherwise
   */
  disableLastpass: PropTypes.bool,

  /**
   * Boolean; pass true to signal to the form that it is actively submitting (e.g. the submit has been clicked and
   * maybe the user is on a slow network or something)
   */
  isSubmitting: PropTypes.bool,
};
LoginForm.defaultProps = {
  buttonText: 'Submit',
  disableLastpass: false,
  isClicking: false,
};

export default LoginForm;
