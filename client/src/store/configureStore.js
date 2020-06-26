import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const middlewares = [thunk];

// eslint-disable-next-line no-undef
const MODE = process.env.NODE_ENV;

const composeDev =
  MODE !== 'production'
    ? composeWithDevTools(applyMiddleware(...middlewares))
    : applyMiddleware(...middlewares);

const store = createStore(rootReducer, composeDev);

export default store;
