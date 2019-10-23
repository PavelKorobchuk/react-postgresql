import React, {Fragment} from "react";
import {
    CSSTransition,
    SwitchTransition
  } from "react-transition-group";
import {
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import '../styles/App.css';
import '../styles/reset.css';
import 'antd/dist/antd.css';
import Header from './layouts/header.jsx';
import PrivateRoute from './layouts/privateRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import io from 'socket.io-client';

export let socket;

function App({location}) {
    const isLoggedIn = () => window.localStorage.getItem('userLogin');
    socket = io(socketUrl);
    return (
        <Fragment>
            <Header isLoggedIn={isLoggedIn} />
            <div className="layout">
                <SwitchTransition className="transition-group">
                    <CSSTransition key={location.key} classNames="fade" timeout={300} unmountOnExit>
                        <Switch location={location}>
                            <Route path="/login" component={LoginPage} />
                            <PrivateRoute isLoggedIn={isLoggedIn}></PrivateRoute>
                        </Switch>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </Fragment>
    );
}

export default withRouter(App);