import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './Home/Home.jsx';
import HomeMenu from './Home/Menu/HomeMenu.jsx';
import Gacha from './Gacha/Gacha.jsx';
import GachaMenu from './Gacha/Menu/GachaMenu.jsx';
import NavTop from './NavTop/NavTop.jsx';


class App extends Component {  // i.e extends React.Component
  constructor(props) {
    super(props);  // Receives access to props from higher-level components (might not be necessary here until Redux?)

    this.state = {
      pageTitle: "Home"
    };

    this.changePageTitle = this.changePageTitle.bind(this);
  }

  changePageTitle(pageTitle) {
    console.log('Changing Page Title to', pageTitle);
    if (typeof pageTitle === String) {
      this.setState({
        pageTitle: pageTitle
      });
    }
  }

  render() {
    return (
      <div>
        {/*<header>*/}
          {/*<Route path="/react" exact component={HomeMenu} />*/}
          {/*<Route path="/react/sif" component={GachaMenu} />*/}
        {/*</header>*/}
        <NavTop changePageTitle={this.changePageTitle} pageTitle={this.state.pageTitle}/>
        <div>
          <b>Welcome to the {this.state.pageTitle} page of Chuuni.me!!!</b>
          <Route path="/react" exact component={Home} />
          <Route path="/react/sif" component={Gacha} />
        </div>
      </div>
    );
  }
}

export default App;