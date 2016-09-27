import ekto from '../../middleware/ekto';
import {
  FETCH_POSTS_PENDING,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_MORE_POSTS_REQUEST,
  FETCH_MORE_POSTS_SUCCESS,
  FETCH_MORE_POSTS_FAILURE,
} from './constants';

function fetchPosts(params) {
  return (dispatch) => {
    dispatch({ type: FETCH_POSTS_REQUEST });
    return ekto.fetch('/posts', params)
      .then((response) => {
        dispatch({ type: FETCH_POSTS_SUCCESS, response });
      })
      .catch(() => {
        dispatch({ type: FETCH_POSTS_FAILURE });
      });
  };
}

function shouldFetchPosts(state) {
  if (!state.posts.list.length ||
      state.posts.readyState === FETCH_POSTS_PENDING ||
      state.posts.readyState === FETCH_POSTS_FAILURE) {
    return true;
  }
  return false;
}

export function fetchPostsIfNeeded(params) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState())) {
      return dispatch(fetchPosts(params));
    }
    return false;
  };
}

export function fetchMorePosts(params) {
  return (dispatch) => {
    dispatch({ type: FETCH_MORE_POSTS_REQUEST });
    return ekto.fetch('/posts', params)
      .then((response) => {
        dispatch({ type: FETCH_MORE_POSTS_SUCCESS, response });
      })
      .catch(() => {
        dispatch({ type: FETCH_MORE_POSTS_FAILURE });
      });
  };
}
