//Header.js is a basic header for the application. It contains conditional rendering
//that will allow the links to display in the Dashboard and Profile view, but not
//the Landing view. This is done using the location.pathname found in react-router-dom
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import './Header.css';

const Header = props => {
    // console.log(props)
    return (
        <div>
        {props.location.pathname !== '/'
            ? (<div className='header-container'>
            <img 
                src = {'https://www.freelogodesign.org/file/app/client/thumb/56cf6e02-8a69-4d55-87ae-0a4e94d66251_200x200.png?15953898519055'} 
                alt = 'Stock Alert' 
                className='header-logo'></img>
            <nav>
                <Link to='/profile' className='nav-links'>{props.user.username} </Link>
                <Link to='/home' className='nav-links'>Home</   Link>
                <Link to='/dash' className='nav-links'>Watchlist</Link>
                
            </nav>
        </div>)
        : null}
        </div>
    )
}
    

const mapStateToProps = (reduxState) => reduxState
export default withRouter(connect(mapStateToProps)(Header));