import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBottom extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar blog-bar navbar-expand-lg navbar-fixed-bottom navbar-dark" aria-label="blog-pagination">
        <ul className="pagination">
          <li className="page-item disabled">
            <Link className="page-link" to="#" tabIndex="-1">Previous</Link>
          </li>
          <li className="page-item">
            <Link className="page-link" to="#">1</Link>
          </li>
          <li className="page-item active">
            <Link className="page-link" to="#">2 <span className="sr-only">(current)</span></Link>
          </li>
          <li className="page-item">
            <Link className="page-link" to="#">3</Link>
          </li>
          <li className="page-item">
            <Link className="page-link" to="#">Next</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavBottom;
