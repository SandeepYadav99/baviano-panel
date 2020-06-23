import {applyMiddleware, compose, createStore} from "redux";
import reducer from "./reducers/index.reducer";
import thunk from "redux-thunk";

/**
 * Created by charnjeetelectrovese@gmail.com on 12/5/2019.
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
