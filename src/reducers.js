import { combineReducers } from 'redux';
import app from './containers/App/reducer';
import post from './containers/Post/reducer';
import posts from './containers/Home/reducer';

export default combineReducers({
  app,
  post,
  posts,
});
