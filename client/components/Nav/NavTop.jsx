import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Navbar, Nav, NavItem } from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { LinkContainer } from 'react-router-bootstrap';

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
            <LinkContainer to="/user">
              <NavItem eventKey={4}>
                <div className="nav-link">{userAppText}</div>
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>

      </Grid>
    </Navbar>
  );
}

export default NavTop;
