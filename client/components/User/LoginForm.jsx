'use strict';

import React, { PureComponent } from 'react';

const LoginForm = props => {
  const { onClick, buttonText, emailRef, passwordRef } = props;

  return (
    <form>
      <div className="form-group">
        <input className="form-control" type="email" ref={emailRef} name="email" />
        <input className="form-control" type="password" ref={passwordRef} name="password" />
        <button onClick={onClick} className="btn btn-default">{buttonText}</button>
      </div>
    </form>
  );
};

export default LoginForm;
