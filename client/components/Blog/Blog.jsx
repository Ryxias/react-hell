import React, { Component } from 'react';
import BlogEntry from './Entry/Entry.jsx';

class Blog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testText: 'HELLO WORLD!!!'
    };
  }

  render() {
    return (
      <div>
        Testing the blog section.
        <BlogEntry testText={this.state.testText}/>
      </div>
    );
  }
}

export default Blog;