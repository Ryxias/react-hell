import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="home-container">
        <h1>Welcome to the {this.props.pageTitle} page of Chuuni.me!!!</h1>
        Sorry, no contents in the Home Page yet!
      </div>
    );
  }
}

export default Home;
