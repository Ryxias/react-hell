import React, { Component } from 'react';
import BlogHeader from './Header/Header.jsx';
import BlogContent from './Content/Content.jsx';
import BlogFooter from './Footer/Footer.jsx';


class Blog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testText: 'HELLO WORLD!!!',
      testEntries: [
        {
          'date': '~8000 BC',
          'title': 'Geronimo!',
          'text': `I didn't exist yet.`
        },
        {
          'date': '9-26-17',
          'title': 'Well...',
          'text': 'I am working on this blog!'
        },
        {
          'date': '10-14-17',
          'title': 'The ting go skrra',
          'text': '# The ting go skrrrra \n ## pap pap cla cla cla \n ### skiddikipapap \n #### and the br br brrr boom \n > skyyya du du ku ku du doom \n ```poom poom```'
        }
      ]
    };
  }

  componentDidMount() {
    $(".blog-bar").show();
  }

  componentWillUnmount() {
    $(".blog-bar").hide();
  }

  render() {
    let testText = this.state.testText;

    return (
      <div className="blog-nav-spacer">
        <div className="blog-container">
          <BlogHeader />
          <BlogContent testText={testText} blogState={this.state} />
          <BlogFooter />
        </div>
      </div>
    );
  }
}

export default Blog;
