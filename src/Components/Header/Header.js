
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import './Header.scss';

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
        dropdownView: false,
        }
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
                <Link to='/home' className='nav-links1'>Search</   Link>
                <Link to='/dash' className='nav-links2'>Watchlist</Link>
                <Link to='/profile' className='nav-links3'>{this.props.user.username} </Link>
            </nav>
            <div className = 'dropdown' onClick = {this.toggleDropdown}>Menu</div>
            {this.state.dropdownView
            ? (
                <nav ClassName = 'mobile-menu'>
                    <ul>
                    <Link to='/home' className='nav-links4'>Search</   Link>
                    <Link to='/dash' className='nav-links5'>Watchlist</Link>
                    <Link to='/profile' className='nav-links6'>{this.props.user.username} </Link>
                    </ul>
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