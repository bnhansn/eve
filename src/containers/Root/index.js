import React, { Component, PropTypes } from 'react';

class Root extends Component {
  renderInitialState() {
    if (this.props.initialState) {
      const innerHtml = `window.__INITIAL_STATE__ = ${JSON.stringify(this.props.initialState)}`;
      return <script dangerouslySetInnerHTML={{ __html: innerHtml }} />;
    }
    return false;
  }

  render() {
    const { head, html, css } = this.props;

    return (
      <html lang="en">
        <head>
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          <link rel="stylesheet" href="/static/styles.css" />
          <style data-aphrodite>${css.content}</style>
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: html }} />
          {this.renderInitialState()}
          {head.script.toComponent()}
          <script src="/static/bundle.js" />
        </body>
      </html>
    );
  }
}

Root.propTypes = {
  css: PropTypes.object,
  html: PropTypes.string,
  initialState: PropTypes.object,
  head: PropTypes.shape({
    title: PropTypes.object,
    meta: PropTypes.object,
    link: PropTypes.object,
    script: PropTypes.object,
  }),
};

export default Root;
