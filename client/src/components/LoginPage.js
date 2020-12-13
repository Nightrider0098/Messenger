import React, { useEffect, useState } from 'react'
import '../App.css'
import {

    useHistory,
    useLocation
} from "react-router-dom";

import a from "./use-auth";
const useAuth = a[0]


export default function LoginPage() {




    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();

    let { from } = location.state || { from: { pathname: "/home" } };
    let login = () => {
        auth.signin(() => {
            history.replace(from);
        });
    };





    const [error_message, seterror_message] = useState('')
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const submitTheForm = () => {
        fetch("/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',

            }, body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'include'

        }).then(e => e.json()).then(e => {
            setUsername("")
            setPassword("")
            // console.log()
            if (e.message && e.message === "authenticated")
                return login()
            else {
                seterror_message("Try Again")
            }
        })
    }


    return (
        <div>
            <div class="wrapper">
                <div class="container">
                    <h1>Welcome</h1>
                    <form>
                        <p>You must log in to view the page at {from.pathname}</p>
                        <p>{error_message}</p>
                        <input placeholder={"username"} onChange={(e) => setUsername(e.target.value)} value={username} />
                        <input id="password" type="password" placeholder={"password"} onChange={(e) => setPassword(e.target.value)} value={password} />
                        <button onClick={submitTheForm} type="button">Login</button>
                    </form>
                </div>
                <ul class="bg-bubbles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>

        </div>
    )
}
