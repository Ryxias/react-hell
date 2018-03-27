import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './Home/Home.jsx';
import Gacha from './Gacha/Gacha.jsx';
import NavTop from './Nav/NavTop.jsx';
import Blog from './Blog/Blog.jsx';
import User from './Blog/User.jsx';
import { Grid } from 'react-bootstrap';



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    const navTopProps = {
      loginUrl: '/login', // or /dashboard
      loginText: 'Login', // or username
    };

    return (
      <div>
        <NavTop {...navTopProps} />
        <Grid fluid>
          <Route path="/" exact component={Home} />
          <Route path="/react" exact component={Home} />
          <Route path="/react/sif" component={Gacha} />
          <Route path="/react/blog/" component={Blog} />
          <Route path="/dashboard" component={User} />
        </Grid>
      </div>
    );
  }
}

export default App;
