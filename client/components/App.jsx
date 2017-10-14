import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './Home/Home.jsx';
import Gacha from './Gacha/Gacha.jsx';
import NavTop from './Nav/NavTop.jsx';
import Blog from './Blog/Blog.jsx';
import NavBottom from './Nav/NavBottom.jsx';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageTitle: "Home",
      isBlog: false
    };

    this.changePageTitle = this.changePageTitle.bind(this);
    this.enableBlogNavBar = this.enableBlogNavBar.bind(this);
    this.disableBlogNavBar = this.disableBlogNavBar.bind(this);
  }

  changePageTitle(pageTitle) {
    console.log('Changing page title to', pageTitle);
    if (typeof pageTitle === 'string') {
      this.setState({
        pageTitle: pageTitle
      });
    }
  }

  enableBlogNavBar() {
    this.setState({
      isBlog: true
    });
    console.log('Enabling blog navbar...');
  }

  disableBlogNavBar() {
    this.setState({
      isBlog: false
    });
    console.log('Disabling blog navbar...');
  }

  render() {
    return (
      <div>
        <NavTop changePageTitle={this.changePageTitle} pageTitle={this.state.pageTitle} enableBlogNavBar={this.enableBlogNavBar} />
        <div className="container-fluid">
          <Route path="/" exact component={Home} />
          <Route path="/react" exact component={Home} />
          <Route path="/react/sif" component={Gacha} />
          <Route path="/react/blog" component={() => <Blog disableBlogNavBar={this.disableBlogNavBar} />} />
        </div>
        { this.state.isBlog ? <NavBottom /> : <div></div>}
      </div>
    );
  }
}

export default App;
