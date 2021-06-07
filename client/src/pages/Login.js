import React from 'react'
import '../styles/login.css'
import { useState } from 'react'
import axios from 'axios'
import { addToken, addUser } from '../utils/auth'

export const Login = (props) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault();
        let res = await axios.post("http://localhost:5000/api/user/login", {
            username, password
        })
        console.log(res)
        if (res.data.success) {
            // addUser(res.data.user)
            // addToken(res.data.token)
            props.setUsername(res.data.user.username)
        }
        setUsername('');
        setPassword('');
    }


    return (
        <div class="join-container">
            <header class="join-header">
                <h1> Chat App</h1>
            </header>
            <main class="join-main">
                <form id="login-form" onSubmit={onSubmit}>
                    <div class="form-control">
                        <label for="username">Kullanıcı Adı</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder=""
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div class="form-control">
                        <label for="password">Şifre</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="******"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button style={{width:120,marginLeft:150}} type="submit" class="btn">Giriş Yap</button>
                </form>
            </main>
        </div>
    )
}



export default Login