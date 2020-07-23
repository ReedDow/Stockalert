import axios from 'axios';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import './scss/home.css';


class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            posts: [],
            postImage: ''
        }
    }

    render(){
        return(
            <div>
                <body>
                Home - display all stocks here
                Search function here
                </body>
            </div>
        )
    }
}
const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(Home);