'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoginForm from '../User/LoginForm.jsx';

import { register } from '../../modules/auth';

/**
 * Containing component under all routes for /user
 *
 * This top level component should only manage the organization of the components beneath it!
 */
class Register extends PureComponent {
  constructor(props) {
    super(props);

    this.emailInput = null;
    this.passwordInput = null;

    this.setEmailInput = element => this.emailInput = element;
    this.setPasswordInput = element => this.passwordInput = element;

    this.onRegister = this.onRegister.bind(this);
  }

  render() {
    const props = {
      onClick: this.onRegister,
      emailRef: this.setEmailInput,
      passwordRef: this.setPasswordInput,
      buttonText: 'Register',
      disableLastpass: true,
      isSubitting: this.props.isRegistering,
    };
    return (
      <div>
        <h1>Register</h1>
        <LoginForm {...props} />
      </div>
    );
  }

  onRegister(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch(register(
      this.emailInput.value,
      this.passwordInput.value
    ));
  }
}

Register.propTypes = {
  isRegistering: PropTypes.bool.isRequired,
};


function mapStateToProps(state) {
  return {
    isRegistering: !!state.user.isRegistering,
  };
}

export default connect(
  mapStateToProps
)(Register);
