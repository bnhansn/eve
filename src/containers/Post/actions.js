import ekto from '../../middleware/ekto';
import {
  FETCH_POST_PENDING,
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,
} from './constants';

export function fetchPost(slug) {
  return (dispatch) => {
    dispatch({ type: FETCH_POST_REQUEST });
    return ekto.fetch(`/posts/${slug}`)
      .then((response) => {
        dispatch({ type: FETCH_POST_SUCCESS, response });
      })
      .catch(() => {
        dispatch({ type: FETCH_POST_FAILURE });
      });
  };
}

function shouldFetchPost(state) {
  if (state.post.readyState === FETCH_POST_PENDING ||
      state.post.readyState === FETCH_POST_FAILURE) {
    return true;
  }
  return false;
}

export function fetchPostIfNeeded(slug) {
  return (dispatch, getState) => {
    if (shouldFetchPost(getState(), slug)) {
      return dispatch(fetchPost(slug));
    }
    return false;
  };
}

export function resetState() {
  return { type: FETCH_POST_PENDING };
}
