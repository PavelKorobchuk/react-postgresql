import React, { Fragment, useEffect } from "react";
import { Link, useRouteMatch, withRouter } from "react-router-dom";
import { Button, notification } from 'antd';
import {socket} from '../App.jsx';

const Header = withRouter((props) => {
    const navMap = [
        {path: '/location', label: 'Servers Location'},
    ];
    const isLoggedIn = props.isLoggedIn();
    const onSignOutHandler = () => {
        window.localStorage.clear();
        props.history.push('/')
    };

    useEffect(() => {
        socket.on("get_notifications", res => {
            const data = {
                message: 'City Counter',
                description: `Count is: ${res.length} items`,
                duration: 3,
            }
            notification.open(data);
        });
        socket.emit('initial_notifications', 35000);

        return () => {
            socket.off('get_notifications');
        };
    }, []);

    return (
        <Fragment>
            <nav className="header-nav">
                <ul>
                    {isLoggedIn ? navMap.map((item) => {
                        return (
                            <li key={item.path} className={`${useRouteMatch({path: item.path, exact: true}) ? 'active' : ''}`}>
                                <Link to={item.path}><Button type="link">{item.label}</Button></Link>
                            </li>
                        )
                    }) : (
                        <li className={`${useRouteMatch({path: '/login', exact: true}) ? 'active' : ''}`}>
                            <Link to='/login'><Button type="link">Sign-in</Button></Link>
                        </li>
                    )}
                    {isLoggedIn ? <li onClick={onSignOutHandler} className="button btn-signout"><Button type="link">Sign-out</Button></li> : null}
                </ul>
            </nav>
        </Fragment>
    );
});

export default Header;