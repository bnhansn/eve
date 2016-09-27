/* eslint-disable global-require */
import 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { Router, match, RouterContext, browserHistory, applyRouterMiddleware } from 'react-router';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { StyleSheetServer } from 'aphrodite';
import { createStore, applyMiddleware } from 'redux';
import useScroll from 'react-router-scroll/lib/useScroll';
import routes from './routes';
import Root from './containers/Root';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const configureStore = initialState => createStoreWithMiddleware(reducers, initialState);

const isClient = typeof document !== 'undefined';

if (isClient) {
  require('normalize.css');
  require('./index.css');

  const store = configureStore(window.__INITIAL_STATE__);

  ReactDOM.render(
    <Provider store={store}>
      <Router
        routes={routes}
        history={browserHistory}
        render={applyRouterMiddleware(useScroll())}
      />
    </Provider>,
    document.getElementById('root')
  );
}

const renderRootComponent = (Component, componentProps, store) => {
  const { html, css } = StyleSheetServer.renderStatic(() =>
    renderToStaticMarkup(
      <Provider store={store}>
        <Component {...componentProps} />
      </Provider>
    )
  );

  const head = Helmet.rewind();
  const initialState = store.getState();

  return `<!doctype html>
    ${renderToStaticMarkup(
      <Root head={head} html={html} css={css} initialState={initialState} />
    )}`;
};

const handleError = (res, error) => res.status(500).send(error.message);

const handleRedirect = (res, redirectLocation) => {
  res.redirect(302, redirectLocation.pathname + redirectLocation.search);
};

const routeIsUnmatched = renderProps => renderProps.routes[renderProps.routes.length - 1].path === '*';

const handleRoute = (res, renderProps) => {
  const store = configureStore();
  const status = routeIsUnmatched(renderProps) ? 404 : 200;
  const readyOnAllActions = renderProps.components
    .filter(component => component.readyOnActions)
    .map(component => component.readyOnActions(store.dispatch, renderProps.params));

  Promise.all(readyOnAllActions)
         .then(() => res.status(status)
                        .send(renderRootComponent(RouterContext, renderProps, store)));
};

export const serverMiddleware = (req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      handleError(error);
    } else if (redirectLocation) {
      handleRedirect(res, redirectLocation);
    } else if (renderProps) {
      handleRoute(res, renderProps);
    } else {
      res.sendStatus(404);
    }
  });
};
