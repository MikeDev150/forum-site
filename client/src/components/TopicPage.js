import { Component } from "react";
import axios from 'axios';
import Post from "./Post";
import CreatePost from "./CreatePost"
import ErrorPopup from "./ErrorPopup";
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';

export default class TopicPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            topicID:null,
            topicName:null,
            posts:[],
            allPosts:[],
            showCreatePost:false,
            error:false,
            errorMsg:<div>You need to log in for that action<br/><Link to='/login'>Log in</Link></div>
        }
    }
    listPosts = () => {
        axios.post("http://localhost:5000/listposts", {
            topicID:this.state.topicID,
        }).then((res) => {
            console.log(res.data);
            this.setState({
                posts:res.data,
                allPosts:res.data,
            });
        }).catch(()=>{
            window.location.href = "/error";
        })
    }
    getTopicID = () => {
        axios.post("http://localhost:5000/topicNameToID", {
            topicName:this.state.topicName,
        }).then((res) => {
            console.log(res.data);
            this.setState({
                topic:res.data,
                topicID:res.data._id,
            })
            console.log(this.state.topicID);
            this.listPosts();
        }).catch(()=>{
            window.location.href = "/error";
        })
    }
    componentDidMount = async() =>{
        const queryString = window.location;
        const name = queryString.pathname.split("/").pop();
        await this.setState({
            topicName:name.toLowerCase(),
        })
        await this.getTopicID();
    }

    changeState = (k,v) =>{
        this.setState({
            [k]:v,
        })
    }

    showPost = () =>{
        if (typeof this.props.user === 'undefined' || this.props.user === null){
            this.setState({
                error:true,
                errorMsg:<div>You need to log in for that action<br/><Link to='/login'>Log in</Link></div>,
            })
            
        }else{
            this.setState({
                showCreatePost:true,
            })
        }
    }

    render(){
        const listPosts = this.state.posts.map((post) =>
            <Post key={post._id} data={post} topicID={this.topicID} user={this.props.user} listPosts={this.listPosts}/>
        );
        return(
            <>
                <div className="topicHeader">
                    <div className="header"><img></img></div>
                    <div className="title">{this.state.topic && this.state.topic.title}</div>
                    <div className="desc">{this.state.topic && this.state.topic.description}</div>
                </div>
                <div className="searchCreate">
                    <SearchBar data={this.state.allPosts} stateToUpdate="posts" updateParent={this.changeState} />
                    <button className="create" onClick={this.showPost}>Create Post</button>
                </div>
                {this.state.showCreatePost && <CreatePost user={this.props.user} updateParent={this.changeState} listPosts={this.listPosts} topicID={this.state.topicID}/>}
                {this.state.error && <ErrorPopup message={this.state.errorMsg} updateParent={this.changeState}/>}
                {listPosts}
            </>
        );
    }
}