import React from 'react';
import BlogEntry from './Entry/Entry.jsx';

const BlogEntries = (testText, blogState) => {
  return blogState.testEntries.map(function (blogPost, index) {
    return (
      <div className="row blog-entry-container" key={index}>
        <hr></hr>
        <BlogEntry testText={testText} blogPost={blogPost}/>
      </div>
    );
  });
};

export default BlogEntries;
