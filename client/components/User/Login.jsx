'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

import LoginForm from './LoginForm.jsx';
import { login } from '../../actions/login_action_creators';

/**
 * Containing component under all routes for /user
 */
class Login extends PureComponent {
  constructor(props) {
    super(props);

    //https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/

    this.emailInput = null;
    this.passwordInput = null;

    // cant use refs until v16.3
    // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    this.setEmailInput = element => this.emailInput = element;
    this.setPasswordInput = element => this.passwordInput = element;

    this.onLoginClick = this.onLoginClick.bind(this);
  }

  render() {
    const props = {
      onClick: this.onLoginClick,
      emailRef: this.setEmailInput,
      passwordRef: this.setPasswordInput,
      buttonText: 'Login',
    };
    return (
      <div>
        <h1>Login</h1>
        <LoginForm {...props} />
        <LinkContainer to="/register">
          <a className="nav-link">or register</a>
        </LinkContainer>
      </div>
    );
  }

  onLoginClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch(login(
      this.emailInput.value,
      this.passwordInput.value
    ));
  }
}

Login.propTypes = {};

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps
)(Login);
