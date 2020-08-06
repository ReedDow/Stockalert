import React, {Component} from 'react';
import StockItem from '../StockItem/StockItem';
import {connect} from 'react-redux';
import './Dashboard.scss';
import axios from 'axios';
// const finnhub = require('finnhub');
// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = "bsdhv07rh5retdgr9tdg"
// const finnhubClient = new finnhub.DefaultApi()

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            posts: [],
            stocks: [],
            postContent: '',
            toggle: false,
            dropdownView: false,
        }
    }

    componentDidMount(){
        axios.get('/api/checkuser')
            .then()
            .catch( () => this.props.history.push('/'));
        this.getUserPosts();
        this.getStocks();
        
    }

    handleInput = (val) => {
        this.setState({postContent: val})
    }

    getStocks = () => {
        axios.get(`/api/symbols/${this.props.user.user_id}`)
        .then(res => this.setState({stocks: res.data}))
        .catch(err => console.log(err));
    }

    getUserPosts = () => {
        axios.get(`/api/posts/${this.props.user.user_id}`)
        .then(res => this.setState({posts: res.data}))
        .catch(err => console.log(err));
    }

    createPost = () => {
        axios.post('/api/post', {id: this.props.user.user_id, postContent: this.state.postContent})
        .then(() => {
            this.getUserPosts();
            this.setState({postContent: ''});
        })
        .catch(err => console.log(err));
    }

    deletePost = (id) => {
        axios.delete(`/api/post/${id}`)
        .then(() => {
            this.getUserPosts();
        })
        .catch(err => console.log(err))
    }

    render(){
        
        const mappedStocks = this.state.stocks.map((symbol, i) => {
            
            return <StockItem 
                symbol={symbol}
                getStocks={this.getStocks}
                news={this.state.news}
                quotes={this.state.quotes}
                key={i} 
            />

            
        })
        const mappedPosts = this.state.posts.map((post, i) => (
            <div className='post-box'>
                <p className='stock-notes'>
                    {post.note_content}
                    </p>
                <button className = 'deletebtn2' onClick={() => this.deletePost(post.note_id)}>x
                </button>
            </div>
        ))
        return(
            <div className='watchlist'>
                <header className = 'header'>
                <h1>Watchlist</h1>
                </header>
                <textarea 
                    rows = '15'
                    cols = '20'
                    wrap = 'hard'
                    value={this.state.postContent}
                    placeholder='Write stock notes here'
                    onChange={(e) => this.handleInput(e.target.value)}/>
                <button className = 'postbtn' onClick={this.createPost}>
                Save</button>
                <div className='post-flex'>
                    {mappedPosts}
                </div>    
                <div className = 'stock-flex'>
                {mappedStocks} 
                </div>
                
            </div>
           
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(Dashboard);