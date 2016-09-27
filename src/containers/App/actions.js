import ekto from '../../middleware/ekto';
import {
  FETCH_ACCOUNT_PENDING,
  FETCH_ACCOUNT_REQUEST,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_FAILURE,
} from './constants';

export function fetchAccount() {
  return (dispatch) => {
    dispatch({ type: FETCH_ACCOUNT_REQUEST });
    return ekto.fetch('/')
      .then((response) => {
        dispatch({ type: FETCH_ACCOUNT_SUCCESS, response });
      })
      .catch(() => {
        dispatch({ type: FETCH_ACCOUNT_FAILURE });
      });
  };
}

function shouldFetchAccount(state) {
  if (state.app.readyState === FETCH_ACCOUNT_PENDING ||
      state.app.readyState === FETCH_ACCOUNT_FAILURE) {
    return true;
  }
  return false;
}

export function fetchAccountIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchAccount(getState())) {
      return dispatch(fetchAccount());
    }
    return false;
  };
}
