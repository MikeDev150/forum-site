import { Component } from "react";
import { Link } from 'react-router-dom';
import OptionsBtn from './OptionsBtn';
import axios from 'axios';
import '../css/index.css';

export default class Topic extends Component {

    removeSpaces = (str) => {
        str = str.replace(/\s+/g, '');
        return str;
    }

    deleteTopic = (e) =>{
        e.preventDefault();
        console.log(this.props.data._id);
        axios.post("http://localhost:5000/deletetopic", {
            topicID:this.props.data._id,
        }).then((res) => {
            this.props.listTopics();
        })
    }

    render(){
        return(
            <>
            <Link to={"topic/" + this.removeSpaces(this.props.data.title)}>
            <div className="item">
                <OptionsBtn delete={this.deleteTopic} user={this.props.user} data={this.props.data}/>
                
                <div id="name" className="title">{this.props.data.title}</div>
                <div className="description">{this.props.data.description ? this.props.data.description : ""}</div>
            </div>
            </Link>
            </>
        );
    }
}