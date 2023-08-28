import { Component } from "react";
import axios from 'axios';
import Topic from "./Topic";
import CreateTopic from "./CreateTopic";
import SearchBar from "./SearchBar";
import ErrorPopup from "./ErrorPopup";
import {Link} from 'react-router-dom'

export default class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            topics:[],
            allTopics:[],
            topicToggle:false,
            showCreateTopic:false,
            userError:null,
            error:false,
            errorMsg:<div>You need to log in for that action<br/><Link to='/login'>Log in</Link></div>
        }
    }

    listTopics = () => {
        axios.post("http://localhost:5000/listalltopics", {
            
        }).then((res) => {
            this.setState({
                topics:res.data,
                allTopics:res.data,
            })
        })
    }

    changeToUnqiueDBString = (str) => {
        str = str.replace(/\s+/g, '').toLowerCase();
        return str;
    }

    createNewTopic = () => {
        var str = "General Topic";
        axios.post("http://localhost:5000/inserttopic", {
            created_by:this.props.user._id,
            title:str,
            lower_title:this.changeToUnqiueDBString(str),
        }).then((res) => {
                console.log(res.data);
        })
    }

    componentDidMount(){
        this.listTopics();
    }

    toggleStuff = () =>{
        this.setState({
            topicToggle:true,
        })
    }

    changeState = (k,v) =>{
        this.setState({
            [k]:v,
        })
    }

    showTopic = () =>{
        if (typeof this.props.user === 'undefined' || this.props.user === null){
            this.setState({
                error:true,
                errorMsg:<div>You need to log in for that action<br/><Link to='/login'>Log in</Link></div>,
            })
        }else{
            this.setState({
                showCreateTopic:true,
            })
        }
    }

    render() {
        const listTopics = this.state.topics.map((topic) =>
            <Topic key={topic._id} data={topic} listTopics={this.listTopics} user={this.props.user}/>
        );
        return (
            <>
                <div className="searchCreate">
                    <SearchBar data={this.state.allTopics} stateToUpdate="topics" updateParent={this.changeState} />
                    <button className="create" onClick={this.showTopic}>Create Topic</button>
                </div>
                {this.state.showCreateTopic && <CreateTopic user={this.props.user} updateParent={this.changeState} listTopics={this.listTopics}/>}
                {this.state.error && <ErrorPopup message={this.state.errorMsg} updateParent={this.changeState}/>}
                {listTopics}
            </>
        )
    }
}
