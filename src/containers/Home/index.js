// @flow
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { fetchPostsIfNeeded, fetchMorePosts } from './actions';
import HomeHeader from '../../components/HomeHeader';
import PostPreview from '../../components/PostPreview';
import PostPreviewTemplate from '../../components/PostPreviewTemplate';
import {
  FETCH_POSTS_PENDING,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_FAILURE,
} from './constants';
import {
  FETCH_ACCOUNT_PENDING,
  FETCH_ACCOUNT_REQUEST,
  FETCH_ACCOUNT_FAILURE,
} from '../App/constants';

const styles = StyleSheet.create({
  button: {
    padding: '.5rem .75rem',
    color: 'rgb(160,165,170)',
    background: '#fff',
    border: '1px solid rgb(160,165,170)',
    borderRadius: '3px',
    ':hover': {
      color: 'rgb(140,145,170)',
      border: '1px solid rgb(140,145,170)',
      cursor: 'pointer',
    },
  },
});

const initialState = {
  page: 1,
  limit: 5,
};

type Post = {
  id: number,
};

type Props = {
  dispatch: () => void,
  app: {
    readyState: string,
    account: {
      description?: string,
      metaTitle?: string,
    },
  },
  posts: {
    readyState: string,
    list: Array<Post>,
    meta: {
      nextPage?: bool,
    },
    isLoadingMorePosts: bool,
  },
};

class Home extends Component {
  static readyOnActions(dispatch) {
    const { page, limit } = initialState;
    return Promise.all([
      dispatch(fetchPostsIfNeeded({ page, limit })),
    ]);
  }

  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  state: {
    page: number,
    limit: number,
  };

  componentDidMount() {
    Home.readyOnActions(this.props.dispatch);
  }

  loadMorePosts() {
    const { page, limit } = this.state;
    this.props.dispatch(fetchMorePosts({ page, limit }));
  }

  handlePagination = () => {
    this.setState({
      page: this.props.posts.meta.nextPage,
    }, () => { this.loadMorePosts(); });
  }

  renderHeader() {
    const { app, app: { account } } = this.props;

    if (app.readyState === FETCH_ACCOUNT_PENDING ||
        app.readyState === FETCH_ACCOUNT_REQUEST ||
        app.readyState === FETCH_ACCOUNT_FAILURE) {
      return null;
    }

    return <HomeHeader account={account} />;
  }

  renderPosts() {
    const { posts } = this.props;

    if (posts.readyState === FETCH_POSTS_PENDING ||
        posts.readyState === FETCH_POSTS_REQUEST) {
      return [1, 2, 3, 4, 5].map(i => <PostPreviewTemplate key={i} />);
    }

    if (posts.readyState === FETCH_POSTS_FAILURE) {
      return <p>Error loading posts</p>;
    }

    return posts.list.map(post => <PostPreview key={post.id} post={post} />);
  }

  render() {
    const { app: { account }, posts: { isLoadingMorePosts, meta: { nextPage } } } = this.props;

    return (
      <div>
        <Helmet title={account.metaTitle} titleTemplate={`${account.metaTitle}`} />
        {this.renderHeader()}
        <section className="container">
          {this.renderPosts()}
          {nextPage && !isLoadingMorePosts &&
            <div style={{ textAlign: 'center', margin: '3rem 0' }}>
              <button
                className={css(styles.button)}
                onClick={this.handlePagination}
              >
                Older posts →
              </button>
            </div>
          }
          {isLoadingMorePosts && [1, 2, 3, 4, 5].map(i => <PostPreviewTemplate key={i} />)}
        </section>
      </div>
    );
  }
}

export default connect(
  state => ({
    app: state.app,
    posts: state.posts,
  }),
)(Home);
