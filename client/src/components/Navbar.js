import { Component } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';

export default class Navbar extends Component{

    logout = () => {
        axios.get("http://localhost:5000/auth/logout", {
            withCredentials: true
        }).then((res) => {
            if (res.data === "done") {
                window.location.href = "/"
            }
        })
    }

    render(){
        return(
            <nav>
                <div className="left">
                    <div className="home">
                        <Link to='/'>Home</Link>
                    </div>
                </div>
                <div className="right">
                    <div className="login">
                        {this.props.user ? (
                            <>
                                <div className="dropdown">
                                    <div className="username">{this.props.user.username}</div>
                                    <div className="dropdown-content">
                                        <div className="logout" onClick={this.logout}>Logout </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link to='/login'>Login</Link>
                        )}
                    </div>
                    
                </div>
            </nav>
        );
    }
}