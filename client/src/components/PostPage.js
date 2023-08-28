import axios from "axios";
import React, { Component } from "react";
import OptionsBtn from './OptionsBtn';
import LikeCounter from './LikeCounter';
import ErrorPopup from './ErrorPopup';
import CreateComment from "./CreateComment";
import Comment from "./Comment";
import {Link} from 'react-router-dom';


export default class PostPage extends Component{

    constructor(props){
        super(props);
        this.state = {
            postObj:undefined,
            dislikeArr:undefined,
            likeArr:undefined,
            error:false,
            errorMsg:<div>You need to log in for that action<br/><Link to='/login'>Log in</Link></div>,
            showCreateComment:false,
            parentComments:null,
            allComments:null,
        }
        this.replyRef = React.createRef();
    }

    getPostFromID = async(ID) =>{
        await axios.post("http://localhost:5000/getpost",{
            postID:ID,
        }).then((res) =>{
            this.setState({
                postObj:res.data,
                dislikeArr:res.data.dislikes,
                likeArr:res.data.likes,
                showComments:false,
            })
        }).catch(()=>{
            window.location.href = "/error";
        })
    }

    getPostID = () =>{
        const query = window.location;
        const url = query.pathname;
        const id = url.split("/").pop();
        return id;
    }

    componentDidMount = async() =>{
        const ID = await this.getPostID();
        await this.getPostFromID(ID);
        await this.getEveryPostComment();
    }

    changeState = (k,v) =>{
        this.setState({
            [k]:v,
        })
    }

    getEveryPostComment = () =>{
        axios.post("http://localhost:5000/getPostComments",{
            postID:this.state.postObj._id,
        }).then((res)=>{
            this.setState({
                allComments:res.data,
            })
            if (this.state.allComments.length === 0){
                this.setState({
                    showComments:false,
                })
            }
            this.getParentComments();
        }).catch(()=>{
            window.location.href = "/404";
        })
    }

    getParentComments = () =>{
        this.setState({
            parentComments:this.state.allComments.filter(function(c){
                return c.parent === null;
            }),
        })
        if (this.state.allComments.length !== 0){
            this.setState({
                showComments:true,
                commentList:this.makeComments(),
            })
        }
        console.log(this.state.parentComments);
        console.log(this.state.allComments);
    }

    makeComments = () =>{
        let arr = [];
        this.state.parentComments.map((com) =>{
                arr.push(
                <Comment key={com._id}
                user={this.props.user}
                comment={com}
                listComments={this.getEveryPostComment}
                updateParent={this.changeState}
                />
                );
                if (!(com.children.length === 0)){
                    let carr = this.makeChildren(2,com);
                    arr.push(carr);
                }
            return 0;
        });
        console.log(arr);
        return arr;
    }

    makeChildren = (num,com) =>{
        let a = [];
        console.log(com.children);
        for(let i = 0;i < com.children.length;i++){
            let margin = `${num}%`;
            let nc = com.children[i];
            console.log(nc);
            console.log(this.state.allComments);
            let newcomment = this.searchAllCommentsById(nc)[0];
            console.log(newcomment);
            a.push(
            <Comment key={newcomment._id}
            user={this.props.user}
            style={{"marginLeft":margin}}
            comment={newcomment}
            listComments={this.getEveryPostComment}
            updateParent={this.changeState}
            />
            )
            if (!(newcomment.children.length === 0)){
                let c = this.makeChildren(num+2,newcomment);
                a.push(c);
            }
        }
        console.log(a);
        return a;
    }

    searchAllCommentsById = (id) =>{
        return(this.state.allComments.filter(function(c){
            return(c._id === id);
        }))
    }

    clickReply = (e) =>{
        e.preventDefault();
        console.log(e);
        if (this.props.user){
            this.setState({
                showCreateComment:true,
            })
        }else{
            this.setState({
                error:true,
                errorMsg:<div>You need to log in for that action<br/><Link to='/login'>Log in</Link></div>,
            });
        }
    }

    render(){
        return(
            <>
                {!(this.state.postObj === undefined) &&
                <>
                <div className="item">
                    <OptionsBtn delete={this.deletePost} user={this.props.user} data={this.state.postObj}/>
                    <div id="name" className="title">{this.state.postObj.title}</div>
                    <div className="description">{this.state.postObj.description ? this.state.postObj.description : ""}</div>
                    <div className="postBtns">
                        { !(this.state.likeArr === undefined) &&
                            <LikeCounter
                            likeArr={this.state.likeArr}
                            dislikeArr={this.state.dislikeArr}
                            user={this.props.user}
                            id={this.state.postObj._id}
                            modal="post"
                            updateParent={this.changeState}
                        />
                        }
                        <div className="reply btn" id="reply" ref={this.replyRef} onClick={this.clickReply}>Reply</div>
                    </div>
                </div>
                <div>
                    {(this.state.showCreateComment) &&
                    <CreateComment
                    updateParent={this.changeState}
                    user={this.props.user}
                    postid={this.state.postObj._id}
                    listComments={this.getEveryPostComment}
                    />}
                </div>
                <div>
                        {this.state.showComments === true &&
                        <div className="commentListWrapper">
                            {this.state.commentList}
                        </div>
                        }
                </div>
                </>
                }
                {this.state.error && <ErrorPopup message={this.state.errorMsg} updateParent={this.changeState}/>}
            </>
        );
    }
}