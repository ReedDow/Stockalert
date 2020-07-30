
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import './Header.css';
import axios from 'axios';

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
        dropdownView: false,
        name: '',
        email: ''

        }
    }

    handleSubmit(event){

        const messageHtml =  renderEmail(
            <MyEmail name={this.state.name}> {this.state.feedback}</MyEmail>
        );
                axios({
                    method: "POST", 
                    url:"http://localhost:3000/send", 
                    data: {
                  name: this.state.name,
                  email: this.state.email,
                  messageHtml: messageHtml
                    }
                }).then((response)=>{
                    if (response.data.msg === 'success'){
                        alert("Email sent, awesome!"); 
                        this.resetForm()
                    }else if(response.data.msg === 'fail'){
                        alert("Oops, something went wrong. Try again")
                    }
                })
    }
    

    toggleDropdown = () => {
        this.setState({dropdownView: !this.state.dropdownView})
    }

    render(){
    return (
        <div>
        {this.props.location.pathname !== '/'
            ? (<div className='header-container'>
            <img 
                src = {'https://www.freelogodesign.org/file/app/client/thumb/56cf6e02-8a69-4d55-87ae-0a4e94d66251_200x200.png?15953898519055'} 
                alt = 'Stock Alert' 
                className='header-logo'></img>
            <nav className = 'desktop-menu'>
                <Link to='/profile' className='nav-links'>{this.props.user.username} </Link>
                <Link to='/home' className='nav-links'>Home</   Link>
                <Link to='/dash' className='nav-links'>Watchlist</Link>
            </nav>
            <div className = 'dropdown' onClick = {this.toggleDropdown}>Menu</div>
            {this.state.dropdownView
            ? (
                <nav ClassName = 'mobile-menu'>
                    <Link to='/profile' className='nav-links'>{this.props.user.username} </Link>
                    <Link to='/home' className='nav-links'>Home</   Link>
                    <Link to='/dash' className='nav-links'>Watchlist</Link>
                </nav>
            )
            : null}
        </div>)
        : null}
        </div>
    )
    }
}
    

const mapStateToProps = (reduxState) => reduxState
export default withRouter(connect(mapStateToProps)(Header));