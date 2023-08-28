import { Component } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export default class CreateTopic extends Component {
    constructor(props){
        super(props);
        this.state = {
            titleError:null,
            nameCharsLeft: 24,
            descCharsLeft: 250,
        }
    }

    changeToUnqiueDBString = (str) => {
        str = str.replace(/\s+/g, '').toLowerCase();
        return str;
    }

    changeNameCharsLeft = () => {
        var titlein = document.getElementById("tname");
        var len = titlein.value.length;
        var left = titlein.maxLength - len;
        this.setState({
            nameCharsLeft:left,
        });
    }

    changeDescCharsLeft = () => {
        var descin = document.getElementById("tdesc");
        var len = descin.value.length;
        var left = descin.maxLength - len;
        this.setState({
            descCharsLeft:left,
        });
    }

    checkForm = () => {
        var tname = document.getElementById("tname");
        if (tname.value.length === 0){
            this.setState({
                titleError: true,
                titleErrorValue: "Name cannot be empty",
            })
            return true;
        }else if (tname.value.length < 3){
            this.setState({
                titleError: true,
                titleErrorValue: "Name must be between 3-24 characters long",
            })
            return true;
        }else if (/[~`!@#$%^&*+=\-[\]\\';,/{}|\\":<>?().]/g.test(tname.value)){
            this.setState({
                titleError: true,
                titleErrorValue: "Name cannot have special characters, Except underscore (_)",
            })
            return true;
        }
        var n = tname.value;
        var nu = this.changeToUnqiueDBString(n);
        axios.post("http://localhost:5000/topicNameToID", {
            topicName: nu,
        }).then((res) => {
            if (res.data === ""){
                this.setState({
                    titleError: false,
                    titleErrorValue: "",
                })
            }else{
                this.setState({
                    titleError: true,
                    titleErrorValue: "Name already taken, Please choose another",
                })
                return true;
            }
        })
        return false;
    }

    submitForm = (e) => {
        e.preventDefault();
        if (this.checkForm()){
            return;
        }
        var tname = document.getElementById("tname");

        var n = tname.value;
        var nu = this.changeToUnqiueDBString(n);

        var newData = {
            created_by: this.props.user._id,
            lower_title: nu,
            title: n,
        };

        if (document.getElementById("tdesc").value.length !== 0){
            newData.description = document.getElementById("tdesc").value
        }
        try {
            axios.post("http://localhost:5000/inserttopic", newData).then((res) => {
                this.props.listTopics();
                this.closeComponent();
            })
        } catch (error) {
            alert("error" + error);
        }
    }

    closeComponent = () =>{
        this.props.updateParent("showCreateTopic",false);
    }

    render(){
        return(
            <>
            <div className="pop-wrapper">
                <div className="pop-up">
                    <div className="pop-up-container">
                        <div className="top">
                            <h1>Create a Topic</h1>
                            <div className="close" onClick={this.closeComponent}>X</div>
                        </div>
                        <form onSubmit={this.submitForm}>
                            <label htmlFor="tname">Topic Name<span className="red-text">*</span></label><br/>
                            <div className="small">The name of your topic
                                <span className="info tooltip">
                                    <FontAwesomeIcon icon={faInfoCircle} /><span className="tooltiptext">Name must be between 3-24 characters long.<br />No Special Characters except Underscore (_).<br />Capitalizion will not affect if the name is taken</span>
                                </span>
                            </div>
                            {this.state.titleError && <div><span className="small error">{this.state.titleErrorValue}</span><br/></div>}
                            <input autoFocus autoComplete="off" maxLength="24" type="text" id="tname" name="tname" onChange={this.changeNameCharsLeft}></input><br />
                            <div className="small">{this.state.nameCharsLeft} characters left</div>

                            <label htmlFor="tdesc">Topic Description</label><br/>
                            <textarea className="small" maxLength="250" type="text" id="tdesc" name="tdesc" onChange={this.changeDescCharsLeft} /><br />
                            <div className="small">{this.state.descCharsLeft} characters left</div>
                            
                            <div className="tbtns">
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