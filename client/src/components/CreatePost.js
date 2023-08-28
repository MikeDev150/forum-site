import { Component } from "react";
import axios from 'axios';

export default class CreatePost extends Component {
    constructor(props){
        super(props);
        this.state = {
            titleError:null,
            descError:null,
            nameCharsLeft: 24,
            descCharsLeft: 500,
            topicID:null,
        }
    }

    componentDidMount = async() =>{
        await this.getTopicID();
    }

    getTopicID = async() => {
        const queryString = window.location;
        const name = queryString.pathname.split("/").pop();
        
        await axios.post("http://localhost:5000/topicNameToID", {
            topicName:name.toLowerCase(),
        }).then((res) => {
            console.log(res.data);
            this.setState({
                topicID:res.data._id,
            })
            console.log(this.state.topicID);
        })
    }

    changeToUnqiueDBString = (str) => {
        str = str.replace(/\s+/g, '').toLowerCase();
        return str;
    }

    changeNameCharsLeft = () => {
        let titlein = document.getElementById("pname");
        let len = titlein.value.length;
        let left = titlein.maxLength - len;
        this.setState({
            nameCharsLeft:left,
        });
    }

    changeDescCharsLeft = () => {
        let descin = document.getElementById("pdesc");
        let len = descin.value.length;
        let left = descin.maxLength - len;
        this.setState({
            descCharsLeft:left,
        });
    }

    checkForm = () => {
        let pname = document.getElementById("pname");
        let error = false;
        if (pname.value.length === 0){
            this.setState({
                titleError: true,
                titleErrorValue: "Title cannot be empty",
            })
            error = true;
        }
        let dname = document.getElementById("pdesc");
        if (dname.value.length === 0){
            this.setState({
                descError: true,
                descErrorValue: "Description cannot be empty",
            })
            error = true;
        }
        if (error) return true;
        return false;
    }

    submitForm = (e) => {
        e.preventDefault();
        if (this.checkForm()){
            return;
        }
        let pname = document.getElementById("pname");

        let n = pname.value;
        let dname = document.getElementById("pdesc").value;

        let newData = {
            topicid:this.props.topicID,
            created_by: this.props.user._id,
            topic:this.state.topicID,
            title: n,
            description: dname,
        };

        try {
            axios.post("http://localhost:5000/insertpost", newData).then((res) => {
                this.props.listPosts();
                this.closeComponent();
            })
        } catch (error) {
            alert("error" + error);
        }
    }

    closeComponent = () =>{
        this.props.updateParent("showCreatePost",false);
    }

    render(){
        return(
            <>
            <div className="pop-wrapper">
                <div className="pop-up">
                    <div className="pop-up-container">
                        <div className="top">
                            <h1>Create a Post</h1>
                            <div className="close" onClick={this.closeComponent}>X</div>
                        </div>
                        <form onSubmit={this.submitForm}>
                            <label htmlFor="tname">Title<span className="red-text">*</span></label><br/>
                            <div className="small">The title of your post</div>
                            {this.state.titleError && <div><span className="small error">{this.state.titleErrorValue}</span><br/></div>}
                            <input autoFocus autoComplete="off" maxLength="24" type="text" id="pname" name="pname" onChange={this.changeNameCharsLeft}></input><br />
                            <div className="small">{this.state.nameCharsLeft} characters left</div>

                            <label htmlFor="tdesc">Description<span className="red-text">*</span></label><br/>
                            {this.state.descError && <div><span className="small error">{this.state.descErrorValue}</span><br/></div>}
                            <textarea className="small" maxLength="500" type="text" id="pdesc" name="pdesc" onChange={this.changeDescCharsLeft} /><br />
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