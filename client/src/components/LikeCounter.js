import React, {Component} from 'react';
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';

export default class LikeCounter extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLiked:false,
            isDisliked:false,
            likeCount:0,
            dislikeCount:0,
        }
        this.likeRef = React.createRef();
        this.dislikeRef = React.createRef();
        this.likeCounterRef = React.createRef();
    }

    componentDidMount = async() =>{
        if (!(this.props.user === null || this.props.user === undefined)){
            if (this.seeIfDisliked()){
                let r = this.state.dislike + 1;
                this.setState({
                    isDisliked:true,
                    isLiked:false,
                    dislikeCount:r,
                });
            }else if (this.seeIfLiked()){
                let r = this.state.likeCount + 1;
                this.setState({
                    isLiked:true,
                    isDisliked:false,
                    likeCount:r,
                });
            }
        }

        await axios.post("http://localhost:5000/getLikesCounts",{
            modal:this.props.modal,
            id:this.props.id,
        }).then((res) =>{
            this.setState({
                likeCount:res.data.likeCount,
                dislikeCount:res.data.dislikeCount,
            })
        })
    }

    seeIfDisliked = () =>{
        let dArr = this.props.dislikeArr;
        for(let i = 0;i<this.props.dislikeArr.length;i++){
            if (dArr[i] === this.props.user._id){
                return true;
            }
        }
        return false;
    }

    seeIfLiked = () =>{
        let lArr = this.props.likeArr;
        for(let i = 0;i<this.props.likeArr.length;i++){
            if (lArr[i] === this.props.user._id){
                return true;
            }
        }
        return false;
    }

    clickBtn = (e) =>{
        e.preventDefault();
        console.log(e);
        console.log(e.target.id);
        if (!(this.props.user === null || this.props.user === undefined)){
            if (e.target.id === 'dislike'){
                axios.post("http://localhost:5000/addUserToDislikes",{
                    id:this.props.id,
                    userID:this.props.user._id,
                    modal:this.props.modal,
                }).then((res)=>{
                    this.switchLikeState(res);
                })
            }else if (e.target.id === "like"){
                axios.post("http://localhost:5000/addUserToLikes",{
                    id:this.props.id,
                    userID:this.props.user._id,
                    modal:this.props.modal,
                }).then((res)=>{
                    this.switchLikeState(res);
                })
            }
        }else{
            this.props.updateParent("error",true);
        }
        
    }

    switchLikeState = (res) =>{
        console.log(res);
        let like = false;
        let dislike = false;
        if (res.data.result === "like"){
            like = true;
        }else if (res.data.result === "dislike"){
            dislike = true;
        }else if (res.data.result === "none"){
            
        }
        this.setState({
            isLiked: like,
            isDisliked: dislike,
            likeCount: res.data.likeCount,
            dislikeCount: res.data.dislikeCount,
        })
    }

    componentDidUpdate = () =>{
        if (this.state.isLiked){
            this.likeRef.current.classList.add("clicked");
            this.dislikeRef.current.classList.remove("clicked")
        }else if (this.state.isDisliked){
            this.dislikeRef.current.classList.add("clicked");
            this.likeRef.current.classList.remove("clicked");
        }else{
            this.likeRef.current.classList.remove("clicked");
            this.dislikeRef.current.classList.remove("clicked");
        }
    }

    render(){
        return(
            <>
            <div className="likeCounter">
                <div className="btn like" ref={this.likeRef} id="like" onClick={this.clickBtn}>
                    <FontAwesomeIcon icon={faArrowUp} />
                </div>
                <div className="counter" ref={this.likeCounterRef}>{this.state.likeCount - this.state.dislikeCount}</div>
                <div className="btn dislike" ref={this.dislikeRef} id="dislike" onClick={this.clickBtn}>
                    <FontAwesomeIcon icon={faArrowDown} />
                </div>
            </div>
            </>
        )
    }
}