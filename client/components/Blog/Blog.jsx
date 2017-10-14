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
        },
        {
          'date': '10-14-17',
          'title': 'The ting go skrra',
          'text': 'The ting go skrrrra\n' +
          'pap pap cla cla cla\n' +
          'skiddikipapap\n' +
          'and the br br brrr boom\n' +
          'skyyya du du ku ku du doom\n' +
          'poom poom'
        }
      ]
    };
  }

  componentWillUnmount() {
    this.props.disableBlogNavBar();
  }

  render() {

    let testText = this.state.testText;

    return (
      <div className="blog-nav-spacer">
        <div className="blog-container">
          <div className="row blog-header">
            <h1>Testing the blog header section.</h1>
          </div>
          <div className="row blog-content">
            <div className="col-xs-3 blog-nav-container">
              <h3>Testing the blog navigation section.</h3>
            </div>
            <div className="col-xs-6 blog-list-container">
              {
                this.state.testEntries.map(function(blogPost, index) {
                  return (
                          <div className="row blog-entry-container" key={index}>
                              <hr></hr>
                              <BlogEntry testText={testText} blogPost={blogPost} />
                          </div>
                         );
                })
              }
            </div>
            <div className="col-xs-3 blog-archive-container">
              <h3>Testing the blog archival section.</h3>
            </div>
          </div>
          <div className="row blog-footer">
            <h4>Testing the blog footer section.</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default Blog;
