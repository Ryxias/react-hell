'use strict';

import React, { Component } from 'react';

import { Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import Home from './Home/Home.jsx';
import Blog from './Blog/Blog.jsx';

import NavAppContainer from './Nav/NavAppContainer.jsx';

import GachaAppContainer from './Gacha/GachaAppContainer.jsx';
import UserAppContainer from './User/UserAppContainer.jsx';
import RegisterAppContainer from './Register/RegisterAppContainer.jsx';
import AlertContainer from './Alert/AlertContainer.jsx';
import GossipAppContainer from './Gossip/GossipAppContainer.jsx';
import WorldClockContainer from './WorldClock/WorldClockContainer.jsx';
import DiceAppContainer from './Dice/DiceAppContainer.jsx';

/**
 * DO NOT Extend PureComponent
 */
class App extends Component {

  render() {
    return (
      <div className="container">
        <section>
          <NavAppContainer />
        </section>
        <section>
          <AlertContainer/>
        </section>
        <section>
          <Grid fluid>
            <Route path="/" exact component={Home} />
            <Route path="/react" exact component={Home} />
            <Route path="/react/sif" component={GachaAppContainer} />
            <Route path="/react/blog/" component={Blog} />
            <Route path="/user" component={UserAppContainer} />
            <Route path="/register" component={RegisterAppContainer} />
            <Route path="/gossip" component={GossipAppContainer} />
            <Route path="/clock" component={WorldClockContainer} />
            <Route path="/dice" component={DiceAppContainer} />
          </Grid>
        </section>
      </div>
    );
  }
}

export default App;
