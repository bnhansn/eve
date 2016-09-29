// @flow
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import moment from 'moment';
import { css, StyleSheet } from 'aphrodite';
import { fetchPost, fetchPostIfNeeded, resetState } from './actions';
import Gravatar from '../../components/Gravatar';
import PostHeader from '../../components/PostHeader';
import PostLoadingTemplate from '../../components/PostLoadingTemplate';
import {
  FETCH_POST_PENDING,
  FETCH_POST_REQUEST,
  FETCH_POST_FAILURE,
} from './constants';
import {
  FETCH_ACCOUNT_PENDING,
  FETCH_ACCOUNT_REQUEST,
  FETCH_ACCOUNT_FAILURE,
} from '../App/constants';

if (typeof document !== 'undefined') {
  require('./styles.css'); // eslint-disable-line
}

const styles = StyleSheet.create({
  post: {
    marginBottom: '2rem',
    wordWrap: 'break-word',
  },

  postTitle: {
    fontSize: '2.5rem',
  },

  postMeta: {
    fontSize: '90%',
    color: 'rgb(160,165,170)',
  },

  postAuthor: {
    display: 'flex',
    alignItems: 'center',
  },
});

type Props = {
  dispatch: () => void,
  params: {
    slug: string,
  },
  app: {
    readyState: string,
    account: Object,
  },
  post: {
    readyState: string,
    data: {
      title: string,
      html: string,
      publishedAt: string,
      image?: string,
      author: {
        name: string,
        email: string,
      },
    },
  },
};

class Post extends Component {
  static readyOnActions(dispatch, params) {
    return Promise.all([
      dispatch(fetchPostIfNeeded(params.slug)),
    ]);
  }

  componentDidMount() {
    Post.readyOnActions(this.props.dispatch, this.props.params);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.slug !== this.props.params.slug) {
      this.props.dispatch(fetchPost(nextProps.params.slug));
    }
  }

  // reset readyState to FETCH_POST_PENDING so next time component
  // mounts fetchPostIfNeeded() fetches the new post
  componentWillUnmount() {
    this.props.dispatch(resetState());
  }

  props: Props;

  renderHeader() {
    const { post, app, app: { account } } = this.props;

    if (post.readyState === FETCH_POST_PENDING ||
        post.readyState === FETCH_POST_REQUEST ||
        post.readyState === FETCH_POST_FAILURE ||
        app.readyState === FETCH_ACCOUNT_PENDING ||
        app.readyState === FETCH_ACCOUNT_REQUEST ||
        app.readyState === FETCH_ACCOUNT_FAILURE) {
      return <div style={{ height: '68px', marginBottom: '4rem' }} />;
    }

    return <PostHeader post={post.data} account={account} />;
  }

  renderPost() {
    const { post } = this.props;

    if (post.readyState === FETCH_POST_PENDING ||
        post.readyState === FETCH_POST_REQUEST) {
      return <PostLoadingTemplate />;
    }

    if (post.readyState === FETCH_POST_FAILURE) {
      return <div>Error loading post</div>;
    }

    return (
      <article className={`post ${css(styles.post)}`}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 className={css(styles.postTitle)}>{post.data.title}</h1>
          <div className={css(styles.postMeta)}>
            <time>{moment(post.data.publishedAt).format('D MMMM YYYY')}</time>
          </div>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.data.html }} />
        <hr style={{ margin: '2rem 0' }} />
        <div className={css(styles.postAuthor)}>
          <span style={{ marginRight: '.75rem' }}>
            <Gravatar email={post.data.author.email} size={24} className="post-author-gravatar" />
          </span>
          <span>{post.data.author.name}</span>
        </div>
      </article>
    );
  }

  render() {
    const { post: { data: { title } } } = this.props;

    return (
      <div>
        <Helmet title={title || ' '} />
        {this.renderHeader()}
        <div className="container">
          {this.renderPost()}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    app: state.app,
    post: state.post,
  }),
)(Post);
