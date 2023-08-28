import React, { Component } from "react";
import OptionsBtn from "./OptionsBtn";
import LikeCounter from "./LikeCounter";
import CreateComment from "./CreateComment";
import axios from 'axios';

export default class Comment extends Component {
    constructor(props){
        super(props);
        this.state = {
            showCreateComment:false,
        }
        this.idRef = React.createRef();
    }

    changeState = (k,v) =>{
        this.setState({
            [k]:v,
        })
    }

    deleteComment = () =>{
        let newData = {
            id:this.props.comment._id,
        }
        console.log(this.props.comment.parent);
        if (this.props.comment.parent !== null){
            newData.parentid = this.props.comment.parent;
        }
        axios.post("http://localhost:5000/deletecomment",newData).then((res)=>{
            this.props.listComments();
        });
    }

    hideComment = () =>{
        axios.post("http://localhost:5000/hideItem",{
            modal:"comment",
            id:this.props.comment._id,
            hide:true,
        })
    }

    clickReply = (e) =>{
        e.preventDefault();
        console.log(e);
        if (this.props.user){
            this.setState({
                showCreateComment:true,
            })
        }else{
            this.props.updateParent("error",true);
        }
    }

    render(){
        return(
            <>
                <div id="userid" ref={this.idRef} style={{"display":"none"}}>{this.props.comment._id}</div>
                <div className="commentWrapper" style={this.props.style}>
                    <OptionsBtn delete={this.deleteComment} user={this.props.user} data={this.props.comment}/>
                    
                    <div className="username small">
                        {console.log(this.props.comment.parent)}
                        <div><span className="commenter">{this.props.comment.created_by_name}</span>{!(this.props.comment.parent === null) && <div>Replying to {this.props.comment.parent_name}</div>}</div> 
                    </div>
                    
                    <div className="comment">
                        {this.props.comment.comment}
                    </div>
                    
                    <div className="postBtns">
                        <LikeCounter
                            likeArr={this.props.comment.likes}
                            dislikeArr={this.props.comment.dislikes}
                            user={this.props.user}
                            id={this.props.comment._id}
                            modal="comment"
                            updateParent={this.changeState}
                        />
                        <div className="reply btn" id="reply" ref={this.replyRef} onClick={this.clickReply}>Reply</div>
                    </div>
                    <div>
                        {(this.state.showCreateComment) &&
                        <CreateComment
                        updateParent={this.changeState}
                        parent={this.idRef.current.innerHTML}
                        user={this.props.user}
                        postid={this.props.comment.postid}
                        listComments={this.props.listComments}
                        />}
                        
                    </div>
                </div>
            </>
        );
    }
}