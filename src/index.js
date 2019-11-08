import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import combinedReducers from './reducers/index.jsx';
import App from "./components/App.jsx";
import {
    BrowserRouter as Router,
  } from "react-router-dom";

const store = createStore(combinedReducers, composeWithDevTools(applyMiddleware(thunk)));

const Container = () => {
    return (
        <Router>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    )
}
if (typeof window !== 'undefined') {
    ReactDOM.hydrate(<Container />, document.getElementById("root"));
}