// @flow
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { fetchAccountIfNeeded } from './actions';

type Props = {
  dispatch: () => void,
  app: {
    account: {
      metaTitle: string,
      metaDescription: string,
    },
  },
  children: any,
};

class App extends Component {
  static readyOnActions(dispatch) {
    return Promise.all([
      dispatch(fetchAccountIfNeeded()),
    ]);
  }

  componentDidMount() {
    App.readyOnActions(this.props.dispatch);
  }

  props: Props;

  render() {
    const { app: { account } } = this.props;

    return (
      <div>
        <Helmet
          title={account.metaTitle}
          titleTemplate={`${account.metaTitle} | %s`}
          meta={[
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'description', content: account.metaDescription },
          ]}
        />
        {this.props.children}
      </div>
    );
  }
}

export default connect(
  state => ({
    app: state.app,
  }),
)(App);
