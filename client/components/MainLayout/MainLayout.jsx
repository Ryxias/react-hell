import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from '../Home/Home.jsx';
import HomeMenu from '../Home/Menu/HomeMenu.jsx';
import Gacha from '../Gacha/Gacha.jsx';
import GachaMenu from '../Gacha/Menu/GachaMenu.jsx';

class MainLayout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <header>
          <Route path="/home" component={HomeMenu} />
          <Route path="/sif" component={GachaMenu} />
        </header>
        <div>
          <Route path="/" exact component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/sif" component={Gacha} />
        </div>
      </div>
    );
  }
}

export default MainLayout;