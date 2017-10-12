import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './Home/Home.jsx';
import Gacha from './Gacha/Gacha.jsx';
import NavTop from './NavTop/NavTop.jsx';
import Blog from './Blog/Blog.jsx';


class App extends Component {
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
          <Route path="/" exact component={Home} />
          <Route path="/react" exact component={Home} />
          <Route path="/react/sif" component={Gacha} />
          <Route path="/react/blog" component={Blog} />
        </div>
      </div>
    );
  }
}

export default App;
