import React from 'react';
import BlogEntry from './Entry/Entry.jsx';
import { Row } from 'react-bootstrap';

const BlogEntries = (testText, blogState) => {
  return blogState.testEntries.map(function (blogPost, index) {
    return (
      <Row className="blog-entry-container" key={index}>
        <hr></hr>
        <BlogEntry testText={testText} blogPost={blogPost}/>
      </Row>
    );
  });
};

export default BlogEntries;
