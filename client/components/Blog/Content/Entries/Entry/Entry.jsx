import React from 'react';
import ReactMarkdown from 'react-markdown';

const BlogEntry = (props) => {
  const { testText, blogPost } = props;

  return (
    <div className="blog-entry">
      There should be text here: { testText }
      <h3>{blogPost.title}</h3>
      <b>Date:</b> {blogPost.date}<br></br>
      <div>
        <ReactMarkdown source={blogPost.text} />
      </div>
    </div>
  );
};

export default BlogEntry;
