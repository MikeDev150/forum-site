import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../css/Error404.css';

export default class Error404 extends Component {
    render(){
        return(
            <section class="page_404">
                <div class="container">
                    <div class="row">	
                        <div class="col-sm-12 ">
                            <div class="col-sm-10 col-sm-offset-1  text-center">
                                <div class="four_zero_four_bg">
                                    <h1 class="text-center ">Something went wrong</h1>
                                </div>
                                
                                <div class="contant_box_404">
                                    <h3 class="h2">
                                        Possible Reasons:
                                    </h3>
                                
                                    <p>Check your internet connection</p>
                                
                                    <p>The URL doesn't exist anymore or was moved</p>
                                    
                                    <Link to="/" class="link_404">Go Home</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}