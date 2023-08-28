import React, { Component } from 'react'
import '../css/Login.css'
import googleImage from '../media/GoogleLogo.png';
import githubImage from '../media/GithubLogo.png';

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    googleLogin = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    }

    githubLogin = () => {
        window.open("http://localhost:5000/auth/github", "_self");
    }

    render() {
        return (
            <div className="login-page">
            <div className="login-form">
                <h1>Login With</h1>
                <div className="login-select-container" onClick={this.googleLogin}>
                    <img src={googleImage} alt="Google Icon" />
                    <p>Login With Google</p>
                </div>

                <div className="login-select-container github-container" onClick={this.githubLogin}>
                    <img src={githubImage} alt="Github Icon" />
                    <p>Login With Github</p>
                </div>

            </div>

        </div>
        )
    }
}
