'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Grid, Navbar, Nav, NavItem } from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { LinkContainer } from 'react-router-bootstrap';

import WorldClockSelection from '../WorldClock/WorldClockSelection.jsx';

const NavTop = (props) => {
  const { userAppText } = props;

  // Adds MD-Bootstrap's style variant of 'dark' to React-Bootstrap
  bootstrapUtils.addStyle(Navbar, 'dark');
  return (
    <Navbar fixedTop fluid collapseOnSelect bsStyle="dark" className="top-navbar">
      <Grid fluid>

      {/* Main Logo button */}
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/" className="waves-effect waves-light">Chuuni.me</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>

      {/* Collapsible content */}
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/react/sif">
              <NavItem eventKey={2}>
                <div className="nav-link">Gacha Roll</div>
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/react/blog">
              <NavItem eventKey={3}>
                <div className="nav-link">Blog</div>
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/gossip">
              <NavItem eventKey={3}>
                <div className="nav-link">Gossip</div>
              </NavItem>
            </LinkContainer>

            {/* Eventually we want to float this guy allllllll ----> the way right */}
            <LinkContainer to="/user">
              <NavItem eventKey={4}>
                <div className="nav-link">{userAppText}</div>
              </NavItem>
            </LinkContainer>
          </Nav>
          <Nav pullRight>
            <WorldClockSelection/>
          </Nav>
        </Navbar.Collapse>

      </Grid>
    </Navbar>
  );
};

NavTop.propTypes = {
  userAppText: PropTypes.string,
};
NavTop.defaultProps = {
  userAppText: 'Login',
};

export default NavTop;
