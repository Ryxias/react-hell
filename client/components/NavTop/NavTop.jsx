import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavTop extends Component {
  constructor(props) {
    super(props);

    this.changeToGachaTitle = this.changeToGachaTitle.bind(this);
    this.changeToHomeTitle = this.changeToHomeTitle.bind(this);

    this.LINK_STATES = {
      Home: [<Link to="/react/sif" className="nav-link" onClick={this.changeToGachaTitle}>Gacha Roll</Link>],
      Gacha: [<Link to="/react/" className="nav-link" onClick={this.changeToHomeTitle}>Home</Link>]
    };
  }

  changeToGachaTitle() {
    this.props.changePageTitle("Gacha");
  }

  changeToHomeTitle() {
    this.props.changePageTitle("Home");
  }

  componentDidMount() {
    // Hides the drop-down menu when a menu item or logo has been clicked

    $(".navbar-brand").click(function(){
      $(".navbar-collapse").collapse("hide");
    });

    $(".navbar-collapse .menu-item").click(function(){
      $(".navbar-collapse").collapse("hide");
    });
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-sticky-top navbar-dark primary-color">

        {/* Main Logo button */}
        <div className="navbar-header">
          <button className="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#navbar-items"
                  aria-controls="navbar-items" aria-expanded="false">
            <span className="sr-only"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link to="/react" className="navbar-brand" onClick={this.changeToHomeTitle}>Chuuni.me</Link>
        </div>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbar-items">
          <ul className="nav navbar-nav">
            {this.LINK_STATES[this.props.pageTitle].map(function(navitem, index) {
              return <li key={index}>{navitem}</li>
            })}
          </ul>
        </div>

      </nav>
    );
  }
}

export default NavTop;
