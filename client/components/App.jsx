'use strict';

import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './Home/Home.jsx';
import Gacha from './Gacha/Gacha.jsx';
import Blog from './Blog/Blog.jsx';

import NavAppContainer from './Nav/NavAppContainer.jsx';
import UserAppContainer from './User/UserAppContainer.jsx';
import { Grid } from 'react-bootstrap';

/**
 * DO NOT Extend PureComponent
 */
class App extends Component {

  render() {
    return (
      <div>
        <NavAppContainer />
        <Grid fluid>
          <Route path="/" exact component={Home} />
          <Route path="/react" exact component={Home} />
          <Route path="/react/sif" component={Gacha} />
          <Route path="/react/blog/" component={Blog} />
          <Route path="/user" component={UserAppContainer} />
        </Grid>
      </div>
    );
  }
}

export default App;
