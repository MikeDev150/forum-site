import React,{ Component } from "react";
import {Link} from 'react-router-dom';
import "../css/Error.css"

export default class ErrorPopup extends Component{

    constructor(props){
        super(props);
        this.messageRef = React.createRef();
    }

    closeComponent = () =>{
        this.props.updateParent("error",false)
    }

    render(){
        return(
            <div className="error-container">
                <div className="pop-up error">
                    <div className="close" onClick={this.closeComponent}>X</div>
                    <br/>
                    <div ref={this.messageRef} className="pop-container">{this.props.message}</div>
                </div>
            </div>
        );
    }
}