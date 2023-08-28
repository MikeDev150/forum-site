import * as React from 'react';

export default class SearchBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            placeHolder:"Search " + this.props.stateToUpdate + "...",
        }
    }

    onSubmit = (e) =>{
        e.preventDefault()
        let query = e.target[0].value;
        let t = this.props.data.slice(0);
        let r = t.filter((d) =>{
            return d.title.toLowerCase().includes(query.toLowerCase());
        })
        this.props.updateParent(this.props.stateToUpdate,r);
    }
    render() {
        return (
            <div className="search">
            <form onSubmit={this.onSubmit}>
                <input type="search" placeholder={this.state.placeHolder} name="search" />
            </form>
            </div>
        );
    };
};