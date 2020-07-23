//Dashboard is where users can view their posts, create new posts, and delete posts.
import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Dashboard.css';
import axios from 'axios';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            posts: [],
            postContent: ''
        }
    }

    componentDidMount(){
        if(!this.props.user.email){
            this.props.history.push('/');
        }
        this.getUserPosts();
    }

    handleInput = (val) => {
        this.setState({postContent: val})
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
        console.log(this.props)
        const mappedPosts = this.state.posts.map((post, i) => (
            <div className='post-box'>
                <p className='stock-notes'>
                    {post.note_content}
                    </p>
                <button onClick={() => this.deletePost(post.note_id)}>Delete
                </button>
            </div>
        ))
        return(
            <div className='watchlist'>
                
                <h1>Watchlist</h1>
                <textarea 
                    rows = '15'
                    cols = '20'
                    wrap = 'hard'
                    value={this.state.postContent}
                    placeholder='Write stock notes here'
                    onChange={(e) => this.handleInput(e.target.value)}/>
                <button onClick={this.createPost}>save</button>
                <div className='post-flex'>
                    {mappedPosts}
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(Dashboard);