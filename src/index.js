import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import thunk from 'redux-thunk';

import reducers from './reducers';
import AppContainer from './containers/AppContainer';
import '../static/style/style.css';
import '../static/style/bootstrap.min.css';

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>
  , document.querySelector('.app-container'));
