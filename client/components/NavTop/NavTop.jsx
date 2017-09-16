import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavTop extends Component {
  constructor(props) {
    super(props);

    this.LINK_STATES = {
      Home: <Link to="/react/sif" onClick={this.changeToGachaPageTitle}>Go to Gacha Roll</Link>,
      Gacha: <Link to="/react/" onClick={this.changeToHomeTitle}>Go Home</Link>
    };

    this.changeToGachaPageTitle = this.changeToGachaPageTitle.bind(this);
    this.changeToHomeTitle = this.changeToHomeTitle.bind(this);
  }

  changeToGachaPageTitle() {
    console.log('Calling changeToGachaPageTitle with', this.props);
    this.props.changePageTitle("Gacha");
  }

  changeToHomeTitle() {
    console.log('Calling changeToHomeTitle');
    this.props.changePageTitle("Home");
  }

  render() {
    return (
      <div>
        <b>Top Menu:</b> {this.LINK_STATES[this.props.pageTitle]}
      </div>
    );
  }
}

export default NavTop;
