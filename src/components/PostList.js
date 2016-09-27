import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const PostList = props =>
  <ul>
    {props.posts.map(post =>
      <li key={post.id}>
        <Link to={`blog/${post.id}`}>{post.title}</Link>
      </li>
    )}
  </ul>;

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default PostList;
