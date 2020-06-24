/* eslint-disable indent */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { actionGetProfile } from './actions/auth_index.action';
// import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
// // import { logger } from 'redux-logger';
import './index.css';
// import reducer from './reducers/index.reducer';
import App from './App';
import One from './views/One.view';
import * as serviceWorker from './serviceWorker';
import {setAuthorizationToken, setAxiosTimezone} from './libs/set_auth_token.utils';
import store from './store';
import {AUTH_USER} from "./actions/auth_index.action";
import { actionGetDashboard } from './actions/Dashboard.action';
import {connectToSocket} from "./libs/socket.utils";
import {actionChangeTheme, actionGetAppSettings} from "./actions/AppSettings.action";

setAxiosTimezone();
if (localStorage.theme) {
    store.dispatch(actionChangeTheme(localStorage.theme));
} else {
    store.dispatch(actionChangeTheme('dark'));
}
if (localStorage.jwt_token) {
    setAuthorizationToken(localStorage.jwt_token);
    store.dispatch({
        type: AUTH_USER,
        payload: { ...(JSON.parse(localStorage.user)), token: localStorage.jwt_token }
    });
    // store.dispatch(actionGetProfile());
    store.dispatch(actionGetDashboard());
    store.dispatch(actionGetAppSettings());
    connectToSocket(localStorage.jwt_token);
} else {
    connectToSocket();
}
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
