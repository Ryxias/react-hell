import React, { Component } from 'react';
import BlogEntry from './Entry/Entry.jsx';

class Blog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testText: 'HELLO WORLD!!!',
      testEntries: [
        {
          'date': '~8000 BC',
          'title': 'Geronimo!',
          'text': 'I didn\'t exist yet.'
        },
        {
          'date': '9-26-17',
          'title': 'Well...',
          'text': 'I am working on this blog!'
        }
      ]
    };
  }

  render() {

    let testText = this.state.testText;

    return (
      <div>
        Testing the blog section.
        {
          this.state.testEntries.map(function(blogPost, index) {
            return (
                    <div className="row" key={index}>
                        <hr></hr>
                        <BlogEntry testText={testText} blogPost={blogPost} />
                    </div>
                   );
          })
        }
      </div>
    );
  }
}

export default Blog;