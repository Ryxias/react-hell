import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavTop extends Component {
  constructor(props) {
    super(props);

    this.changeToGachaTitle = this.changeToGachaTitle.bind(this);
    this.changeToHomeTitle = this.changeToHomeTitle.bind(this);
    this.changeToBlogTitle = this.changeToBlogTitle.bind(this);

    this.LINK_STATES = {
      Home: [<Link to="/react/sif" className="nav-link waves-effect waves-light" onClick={this.changeToGachaTitle}>Gacha Roll</Link>],
      Gacha: [<Link to="/react/" className="nav-link waves-effect waves-light" onClick={this.changeToHomeTitle}>Home</Link>]
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

    $(".navbar-collapse .nav-item").click(function(){
      $(".navbar-collapse").collapse("hide");
    });
  }

  render() {
    return (
      <nav className="navbar top-navbar navbar-expand-lg navbar-fixed-top navbar-dark">
        <div className="container-fluid">
        {/* Main Logo button */}
        <div className="navbar-header">
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-items"
                  aria-expanded="false" aria-label="Toggle navigation">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link to="/react" className="navbar-brand waves-effect waves-light" onClick={this.changeToHomeTitle}>Chuuni.me</Link>
        </div>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbar-items">
          <ul className="nav navbar-nav mr-auto">

            {/*{this.LINK_STATES[this.props.pageTitle].map(function(navitem, index) {*/}
              {/*return <li key={index} className="nav-item">{navitem}</li>*/}
            {/*})}*/}
            <li className="nav-item">
              <Link to="/react/" className="nav-link" onClick={this.changeToHomeTitle}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/react/sif" className="nav-link" onClick={this.changeToGachaTitle}>Gacha Roll</Link>
            </li>
            <li className="nav-item">
              <Link to="/react/blog" className="nav-link" onClick={this.changeToBlogTitle}>Blog</Link>
            </li>
          </ul>
        </div>

        </div>
      </nav>
    );
  }
}

export default NavTop;
