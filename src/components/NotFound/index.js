import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

const NotFound = () =>
  <div style={{ margin: '2rem auto', textAlign: 'center' }}>
    <Helmet title="404 | Not Found" />
    <p>Page not found</p>
    <p><Link to="/">Go to the home page →</Link></p>
  </div>;

export default NotFound;
