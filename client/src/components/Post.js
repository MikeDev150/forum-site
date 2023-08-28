import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LikeCounter from './LikeCounter';
import axios from 'axios';
import OptionsBtn from './OptionsBtn';
import ErrorPopup from './ErrorPopup';

export default class Post extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLiked:false,
            isDisliked:false,
            error:false,
            errorMsg:<div>You need to log in for that action<br/><Link to='/login'>Log in</Link></div>
        }
    }

    componentDidMount = () =>{
        console.log(this.props.user);

    }

    deletePost = () =>{
        axios.post("http://localhost:5000/deletepost",{
            id:this.props.data._id,
        }).then((res) => {
            this.props.listPosts();
        })
    }

    changeState = (k,v) =>{
        this.setState({
            [k]:v,
        })
    }

    render() {
        return (
            <>
            <Link to={window.location.pathname + "/post/" + this.props.data._id}>
                <div className="item">
                    <OptionsBtn delete={this.deletePost} user={this.props.user} data={this.props.data}/>
                    <div id="name" className="title">{this.props.data.title}</div>
                    <div className="description">{this.props.data.description ? this.props.data.description : ""}</div>
                    {console.log(this.props.data._id)}
                    <LikeCounter
                        likeArr={this.props.data.likes}
                        dislikeArr={this.props.data.dislikes}
                        user={this.props.user}
                        id={this.props.data._id}
                        modal="post"
                        updateParent={this.changeState}
                    />
                </div>
            </Link>
            {this.state.error && <ErrorPopup message={this.state.errorMsg} updateParent={this.changeState}/>}
            </>
        )
    }
}
