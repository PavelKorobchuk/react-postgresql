import React, { Fragment } from 'react';
import {
    Redirect,
    Route,
    Switch
  } from "react-router-dom";

import LocationPage from '../pages/LocationPage.jsx';
import ServerListPage from '../pages/ServerListPage.jsx';
import ServerDetails from '../pages/ServerDetails.jsx';

export default function PrivateRoute(props) {
    const isLoggedIn = props.isLoggedIn();
    return (
        <Fragment>
            {isLoggedIn ? (
                <Fragment>
                    <Switch>
                    <Route exact path="/location" component={LocationPage} />
                    <Route exact path="/list" component={ServerListPage} />
                    <Route path="/list/:id" component={ServerListPage} />
                    <Route path="/details/:id" component={ServerDetails} />
                    <Redirect from='/' to="/location" />
                    </Switch>
                </Fragment>
            ) : <Redirect to="/login"/>}
        </Fragment>
    )
}
