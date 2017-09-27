import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavTop extends Component {
  constructor(props) {
    super(props);

    this.changeToGachaTitle = this.changeToGachaTitle.bind(this);
    this.changeToHomeTitle = this.changeToHomeTitle.bind(this);
    this.changeToBlogTitle = this.changeToBlogTitle.bind(this);

    this.LINK_STATES = {
      Home: [<Link to="/react/sif" className="menu-item" onClick={this.changeToGachaTitle}>Gacha Roll</Link>,
             <Link to="/react/blog" className="menu-item" onClick={this.changeToBlogTitle}>Blog</Link>],
      Gacha: [<Link to="/react/" className="menu-item" onClick={this.changeToHomeTitle}>Home</Link>,
              <Link to="/react/blog" className="menu-item" onClick={this.changeToBlogTitle}>Blog</Link>],
      Blog: [<Link to="/react/" className="menu-item" onClick={this.changeToHomeTitle}>Home</Link>,
             <Link to="/react/sif" className="menu-item" onClick={this.changeToGachaTitle}>Gacha Roll</Link>]
    };
  }

  changeToGachaTitle() {
    this.props.changePageTitle("Gacha");
  }

  changeToHomeTitle() {
    this.props.changePageTitle("Home");
  }

  changeToBlogTitle() {
    this.props.changePageTitle("Blog");
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
      <nav className="navbar navbar-sticky-top navbar-default">

        {/* Main Logo button */}
        <div className="navbar-header">
          <button className="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#navbar-items"
                  aria-expanded="false">
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
