import React, {useState} from 'react';
import { Redirect } from "react-router-dom";

export default function LoginPage(props) {
    const [state, setState] = useState({
        redirectToPreviousRoute: false
    });
    const userLogin = React.createRef();
    const userPass = React.createRef();
    const { from } = props.location.state || { from: { pathname: "/" } };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const data = JSON.stringify({user: userLogin.current.value, password: userPass.current.value});
        window.localStorage.setItem('userLogin', data);
        setState({
            ...state,
            disableBtn: true,
            redirectToPreviousRoute: true
        });
    }

    return (
        <div>
            {state.redirectToPreviousRoute ? <Redirect to={from}/> : (
            <div>
                <h2>Login page</h2>
                <form id="login-form" onSubmit={handleSubmit}>
                    <div className="row">
                        <label htmlFor="login"></label>
                        <input type="text" id="login" placeholder='login' ref={userLogin} />
                    </div>
                    <div className="row">
                        <label htmlFor="pass"></label>
                        <input type="password" id="pass" placeholder='password' ref={userPass} />
                    </div>
                    <button type="submit" disabled={state.disableBtn}>Log-in</button>
                </form>
            </div>) 
        }
        </div>
    )
}
