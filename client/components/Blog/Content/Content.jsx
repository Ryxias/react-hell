import React from 'react';
import BlogEntries from './Entries/Entries.jsx';
import BlogArchives from './Archives/Archives.jsx';
import { Row, Col } from 'react-bootstrap';

const BlogContent = (props) => {
  const { testText, blogState } = props;

  return (
    <Row className="blog-content">
      <Col xs={9} className="blog-list-container">
        { BlogEntries(testText, blogState) }
      </Col>
      <BlogArchives />
    </Row>
  );
};

export default BlogContent;
