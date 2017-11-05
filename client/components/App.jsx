import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './Home/Home.jsx';
import Gacha from './Gacha/Gacha.jsx';
import NavTop from './Nav/NavTop.jsx';
import Blog from './Blog/Blog.jsx';
import { Grid } from 'react-bootstrap';



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div>
        <NavTop />
        <Grid fluid>
          <Route path="/" exact component={Home} />
          <Route path="/react" exact component={Home} />
          <Route path="/react/sif" component={Gacha} />
          <Route path="/react/blog/" component={Blog} />
        </Grid>
      </div>
    );
  }
}

export default App;
