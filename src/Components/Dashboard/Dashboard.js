import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Dashboard.css';
import axios from 'axios';
import moment from 'moment';
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "bsdhv07rh5retdgr9tdg"
const finnhubClient = new finnhub.DefaultApi()

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            posts: [],
            stocks: [],
            postContent: '',
            quotes: {},
            news: [],
            toggle: false
            
        }
    }

    componentDidMount(){
        if(!this.props.user.email){
            this.props.history.push('/');
        }
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

    getNews = (symbol) => {
        let date= moment().format("YYYY-MM-DD")
        return finnhubClient.companyNews(`${symbol}`, `${date}`, `${date}`, (error, data, response) => {
            if (error) {
                console.error(error);
            } else {
                
                console.log(data)
                this.setState({news: data})
            }
        });
    }

    getQuotes = (symbol) => {
         return finnhubClient.quote(`${symbol}`, (error, data, response) => {
        if(error){console.log(error)}
        const{c,o,h,l} = data
        this.setState({quotes:{c, o, h, l}})
        console.log(data)
        
        this.setState({toggle: !this.state.toggle})
        });
        
        
    }

    deleteSymbol = (symbol) => {
        axios.delete(`/api/symbol/${symbol}`)
        .then(() => {
            this.getStocks();
        })
        .catch(err => console.log(err))
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
            
            return <div 
                    key={symbol.symbol}
                    className = 'symbol-box'>
                        <span className= 'symbol'>
                            {symbol.symbol}
                        </span>
                        
                    <button className = 'deletebtn' onClick={() => this.deleteSymbol(symbol.stock_id)}>Delete From Watchlist
                    </button>
                
                    <button onClick={() => this.getQuotes(symbol.symbol)}
                            className = 'quote'>Quote</button>
                            
                    <span style={{display: this.state.toggle ? 'block': 'none'}}
                     className = 'fullquote'>
                        <div className = 'current'>{this.state.quotes.c}</div>
                        <div className = 
                        'open'>Open: {this.state.quotes.o}</div>
                        <div className = 'high'>Today's High:{this.state.quotes.h}</div>
                        <div className = 'low'>Today's Low: {this.state.quotes.l}</div>
                    </span>
                
                
                    <button onClick={() => this.getNews(symbol.symbol)}
                            className = 'news'>News</button>
                    {/* <span>{this.state.news}</span> */}
                
            </div>
        })
        const mappedPosts = this.state.posts.map((post, i) => (
            <div className='post-box'>
                <textarea 
                    rows = '15'
                    cols = '20'
                    wrap = 'hard'
                    value={this.state.postContent}
                    placeholder='Write stock notes here'
                    onChange={(e) => this.handleInput(e.target.value)}/>
                <button className = 'postbtn' onClick={this.createPost}>
                Save</button>
                <p className='stock-notes'>
                    {post.note_content}
                    </p>
                <button className = 'deletebtn' onClick={() => this.deletePost(post.note_id)}>Delete
                </button>
            </div>
        ))
        return(
            <body className = 'wBody'>
            <div className='watchlist'>
                
                <h1>Watchlist</h1>
                <div className='post-flex'>
                    
                    {mappedStocks} 
                    {mappedPosts}
                    
                </div>
                
            </div>
            </body>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(Dashboard);