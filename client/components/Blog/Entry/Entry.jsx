import React from 'react';

const BlogEntry = ({ testText, blogPost }) => {
  return (
    <div>
      There should be text here: { testText }
      <h3>{blogPost.title}</h3>
      <b>Date:</b> {blogPost.date}<br></br>
      <div>
        {blogPost.text}
      </div>
    </div>
  );
};

export default BlogEntry;