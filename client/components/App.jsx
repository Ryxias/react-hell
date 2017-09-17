import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './Home/Home.jsx';
import Gacha from './Gacha/Gacha.jsx';
import NavTop from './NavTop/NavTop.jsx';


class App extends Component {  // i.e extends React.Component
  constructor(props) {
    super(props);

    this.state = {
      pageTitle: "Home"
    };

    this.changePageTitle = this.changePageTitle.bind(this);
  }

  changePageTitle(pageTitle) {
    console.log('Changing page title to', pageTitle);
    if (typeof pageTitle === 'string') {
      this.setState({
        pageTitle: pageTitle
      });
    }
  }

  render() {
    return (
      <div>
        <NavTop changePageTitle={this.changePageTitle} pageTitle={this.state.pageTitle} />
        <div className="container-fluid">
          <h1>Welcome to the {this.state.pageTitle} page of Chuuni.me!!!</h1>
          <Route path="/react" exact component={Home} />
          <Route path="/react/sif" component={Gacha} />
        </div>
      </div>
    );
  }
}

export default App;