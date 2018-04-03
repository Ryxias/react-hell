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
  const { onClick, buttonText, emailRef, passwordRef, disableLastpass } = props;

  // Note: the lastpass disable doesnt seem to work consistently
  // https://stackoverflow.com/questions/20954944/stop-lastpass-filling-out-a-form

  return (
    <form className="container-fluid" autoComplete={disableLastpass ? 'off' : 'on'}>
      <div className="form-group">
        <input className="form-control" type="email" ref={emailRef} name="email" data-lpignore={disableLastpass} />
        <input className="form-control" type="password" ref={passwordRef} name="password" data-lpignore={disableLastpass} />
        <button onClick={onClick} className="btn btn-default">{buttonText}</button>
      </div>
    </form>
  );
};

LoginForm.propTypes = {
  onClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  emailRef: PropTypes.func,
  passwordRef: PropTypes.func,
  disableLastpass: PropTypes.bool,
};
LoginForm.defaultProps = {
  buttonText: 'Submit',
  disableLastpass: false,
};

export default LoginForm;
