import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {getUser} from '../../redux/reducer';
import './Landing.css';

class Landing extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            verPassword: '',
            registerView: false
        }
    }

    componentDidMount(){
        if(this.props.user.email){
            this.props.history.push('/dash');
        }
    }

    handleInput = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleToggle = () => {
        this.setState({registerView: !this.state.registerView})
    }

    handleRegister = () => {
        const {username, email, password, verPassword} = this.state;
        if(password && password === verPassword){
            axios.post('/api/register', {username, email, password})
            .then(res => {
                this.props.getUser(res.data);
                this.props.history.push('/dash');
            })
            .catch(err => console.log(err))
        } else {
            alert('Passwords do not match');
        }
    }

    handleLogin = () => {
        const {email, password} = this.state;
        axios.post('/api/login', {email, password})
        .then(res => {
            this.props.getUser(res.data);
            this.props.history.push('/dash');
        })
        .catch(err => console.log(err));
    }

    render(){
        return(
            
            <form className='landing-container'>
                <section className='authentication-info'>
                <img 
                src = {'https://www.freelogodesign.org/file/app/client/thumb/56cf6e02-8a69-4d55-87ae-0a4e94d66251_200x200.png?1595389851905'} 
                alt = 'Stock Alert' 
                className='logo'></img>
                    {this.state.registerView
                    ? (<>
                        <h3>Register Below</h3>
                        <input 
                            value={this.state.username}
                            name='username'
                            placeholder='Username'
                            onChange={(e) => this.handleInput(e)}/>
                       </>)
                    : <div/>}
                    <input 
                        value={this.state.email}
                        name='email'
                        placeholder='Email'
                        onChange={(e) => this.handleInput(e)}/>
                    <input 
                        type='password'
                        value={this.state.password}
                        name='password'
                        placeholder='Password'
                        onChange={(e) => this.handleInput(e)}/>
                    {this.state.registerView
                    ? (<>
                        <input 
                            type='password'
                            value={this.state.verPassword}
                            name='verPassword'
                            placeholder='Verify Password'
                            onChange={(e) => this.handleInput(e)}/>
                        <button onClick={this.handleRegister}>Register</button>
                        <p>Have an account? <span onClick={this.handleToggle}>Login Here</span></p>
                       </>)
                    : (<>
                        <button onClick={this.handleLogin}>Login</button>
                        <span onClick={this.handleToggle}>Register</span>
                       </>)}
                </section>
            </form>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps, {getUser})(Landing);