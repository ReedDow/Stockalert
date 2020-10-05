import {connect} from 'react-redux';
import './scss/home.scss';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import React, { Component } from "react";
import axios from "axios";
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "bsdhv07rh5retdgr9tdg"
const finnhubClient = new finnhub.DefaultApi()


class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            symbols: [],
            descriptions: [],
            filteredSymbols: [],
            search: '',
        }
    }

  componentDidMount(){
      this.getDescriptions()
      this.getSymbols()
  }
  
  handleSearch = (event) => {
    let keyword = event.target.value;
    this.setState({search: keyword})
  };

  handleReset = () =>{
    this.setState({search: ''})
    this.setState({filteredSymbols: []})
  };

  handleClick = (symbol) => {
    console.log(this.props)
    axios.post('/api/symbol', {id: this.props.user.user_id, symbol})
  
        
      .catch(err => console.log(err));
  };

  //get stock symbols from API and store in state
  getSymbols = () => {
    finnhubClient.stockSymbols("US", (error, data, response) => {
      this.state.symbols =  data.map( elem => {
          return elem.symbol 
      })
  })
  };

    //get stock desc from API and store in state
  getDescriptions = () => {
    finnhubClient.stockSymbols("US", (error, data, response) => {
      this.state.descriptions = data.map( elem => {
          return elem.description 
      })
  })
  };

  render(){
    let filteredSymbols = this.state.symbols.filter((data) => {
      if(this.state.search == '')
        return false
      else if(data.toLowerCase().includes(this.state.search.toLowerCase())){
        return true
      }
      else return false
    }).map((data) => {
      return(
        <div>
          <span 
            onClick = {() => {this.handleClick(data);
              ToastsStore.success("Added to Watchlist") }}
            className = 'tooltip'>
            <ToastsContainer store={ToastsStore}/>
            
            {data}
            </span>

        </div>
        
      )
    })
    
        return(
            <div className = 
            'home-body'>
                <p className = 'intro'> Sit back and relax. We'll email you if your stocks drop.</p>
                <section className = 'searchcontainer'>
                <input 
                    type = 'text'
                    className = 'searchinput'
                    placeholder = 'Search stocks by symbol'
                    onChange ={(e) => this.handleSearch(e)}
                    />
                {/* <button onClick = {(e) => this.handleSearch(e)}
                className = 'srchbtn'>Search</button>
                <button 
                  onClick = {this.handleReset}
                  className = 'resetbtn'>Reset</button> */}
                </section>

                <section className = 'dashboard'>
                {filteredSymbols}
                </section>

            </div>
        )
    }
}
const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(Home);

