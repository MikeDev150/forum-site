import React, { Component } from "react";
import axios from 'axios';

export default class CreateComment extends Component {
    constructor(props){
        super(props);
        this.state = {
            descError:null,
            descCharsLeft: 500,
            postID:null,
            commentParentID:null,
        }
        this.commentRef = React.createRef();
    }

    changeDescCharsLeft = () => {
        let descin = document.getElementById("cComment");
        let len = descin.value.length;
        let left = descin.maxLength - len;
        this.setState({
            descCharsLeft:left,
        });
    }

    checkForm = () => {
        let error = false;
        let cname = document.getElementById("cComment");
        if (cname.value.length === 0){
            this.setState({
                descError: true,
                descErrorValue: "Comment cannot be empty",
            })
            error = true;
        }
        if (error) return true;
        return false;
    }

    submitForm = (e) => {
        e.preventDefault();
        console.log(e);
        if (this.checkForm()){
            return;
        }

        let cname = this.commentRef.current.value;
        console.log(cname);

        let newData = {
            created_by: this.props.user._id,
            created_by_name: this.props.user.username,
            postid:this.props.postid,
            comment:cname,
        };

        if (this.props.parent) newData.parentid = this.props.parent;
        
        try {
            axios.post("http://localhost:5000/insertcomment", newData).then((res) => {
                this.props.listComments();
                this.closeComponent();
            })
        } catch (error) {
            alert("error" + error);
        }
    }

    closeComponent = () =>{
        this.props.updateParent("showCreateComment",false);
    }

    render(){
        return(
            <>
            <div className="pop-wrapper">
                <div className="pop-up replywrapper">
                    <div className="pop-up-container ">
                        <div className="top">
                            <h1>Reply</h1>
                            <div className="close" onClick={this.closeComponent}>X</div>
                        </div>
                        <form onSubmit={this.submitForm}>

                            {this.state.descError && <div><span className="small error">{this.state.descErrorValue}</span><br/></div>}
                            <textarea className="small" maxLength="500" type="text" id="cComment" ref={this.commentRef} name="cComment" onChange={this.changeDescCharsLeft} /><br />
                            <div className="small">{this.state.descCharsLeft} characters left</div>
                            
                            <div className="pbtns">
                                <button className="cancelbtn create" type="button" onClick={this.closeComponent}>Cancel</button>
                                <button className="createbtn create" type="submit">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </>
        )
    }
}