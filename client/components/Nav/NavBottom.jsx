import React, { Component } from 'react';
import { Nav, Pagination } from 'react-bootstrap';

class NavBottom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey,
    });
  }

  render() {
    return (
      <Nav className="blog-pagination" aria-label="blog-pagination">
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          items={10}
          maxButtons={3}
          activePage={this.state.activePage}
          onSelect={this.handleSelect}
        />
      </Nav>
    );
  }
}

export default NavBottom;
