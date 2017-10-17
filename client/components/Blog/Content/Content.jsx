import React from 'react';
import BlogEntries from './Entries/Entries.jsx';
import BlogArchives from './Archives/Archives.jsx';

const BlogContent = (props) => {
  const { testText, blogState } = props;

  return (
    <div className="row blog-content">
      <div className="col-xs-9 blog-list-container">
        { BlogEntries(testText, blogState) }
      </div>
      <BlogArchives />
    </div>
  );
};

export default BlogContent;
