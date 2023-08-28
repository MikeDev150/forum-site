import { Component } from "react";
import { faEllipsisV, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class OptionsBtn extends Component{
    handleClick = (e) =>{
        if (typeof e === 'object') {
            switch (e.button) {
                case 0:
                    //Left btn clicked
                    //Get the composedpath of the ele we clicked on
                    var cp = e.composedPath();
                    var optionsClicked = false;
                    for(var i = 0;i<cp.length;i++){
                        // #document doesn't have .classList so check for that first
                        if (cp[i].nodeName === '#document') break;
                        //Check if there's an ele with class options-container
                        //Meaning we clicked an options btn
                        if (cp[i].classList.contains('options-container')){
                            optionsClicked = true;
                            break;
                        }
                    }
                    //If we didn't click an options btn hide all options btns
                    if (!optionsClicked){
                        var doc = document.getElementsByClassName("options-content");
                        var j;
                        for(j = 0;j<doc.length;j++){
                            doc[j].classList.remove("show");
                        }
                    }
                break;
                case 1:
                    //Middle btn clicked
                break;
                case 2:
                    //Right btn clicked
                break;
                default:
                break;
            }
        }
        
    }

    componentDidMount = () =>{
        document.addEventListener('mouseup',this.handleClick);
    }
    
    componentWillUnmount = () =>{
        document.removeEventListener('mouseup',this.handleClick);
    }

    isMod = () =>{
        if (this.props.user){
            if ((this.props.user.role === 'admin' || this.props.data.created_by === this.props.user._id)){
                return true
            }
        }
        return false;
    }

    optionsClick = (e) =>{
        e.preventDefault();
        var d = e.currentTarget;
        //Get the options button that we clicked
        var o = d.getElementsByClassName("options-content")[0];
        //Toggle the btn we clicked
        o.classList.toggle("show");
        //Get all other options btns in the site
        var doc = document.getElementsByClassName("options-content");
        var i;
        for(i = 0;i<doc.length;i++){
            //Hide all options btns except the one we clicked on
            if (doc[i] !== o){
                doc[i].classList.remove("show");
            }
        }
    }

    render(){
        return(
            <>
            {this.isMod() &&
                <div className="options-container" type="button" onClick={this.optionsClick}>
                    <div className="three-dots"><FontAwesomeIcon icon={faEllipsisV}/></div>

                    <div className="options-content">
                        {this.props.hide && <div><div className="content" onClick={this.props.hide}><FontAwesomeIcon className="icon" icon={faEyeSlash}/> Hide</div><hr className="solid"/></div>}
                        <div className="content" onClick={this.props.delete}><FontAwesomeIcon className="icon" icon={faTrash}/> Delete</div>
                    </div>
                </div>
            }
            </>
        )
    }
}