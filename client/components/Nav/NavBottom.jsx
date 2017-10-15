import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBottom extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="blog-bar" aria-label="blog-pagination" hidden>
        <ul className="pagination">
          <li className="page-item disabled">
            <Link className="page-link blog-page" to="/react/blog" tabIndex="-1">Previous</Link>
          </li>
          <li className="page-item">
            <Link className="page-link blog-page" to="/react/blog">1</Link>
          </li>
          <li className="page-item active">
            <Link className="page-link blog-page" to="/react/blog">2 <span className="sr-only">(current)</span></Link>
          </li>
          <li className="page-item">
            <Link className="page-link blog-page" to="/react/blog">3</Link>
          </li>
          <li className="page-item">
            <Link className="page-link blog-page" to="/react/blog">Next</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavBottom;
