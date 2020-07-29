import {connect} from 'react-redux';
import './scss/home.css';
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
            // high_prices: [],
            // low_proces: [],
            // current_prices: [],
            symbols: [],
            descriptions: [],
            filteredSymbols: [],
            search: null,

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
    this.setState({search: null})
  };

  handleClick = (symbol) => {
    console.log(this.props)
    axios.post('/api/symbol', {id: this.props.user.user_id, symbol})
  
        
      .catch(err => console.log(err));
  };

  getSymbols = () => {
    axios.get(finnhubClient.stockSymbols("US", (error, data, response) => {

      this.state.symbols =  data.map( elem => {
        
          return elem.symbol 
      })
  }))
  };

  getDescriptions = () => {
    axios.get(finnhubClient.stockSymbols("US", (error, data, response) => {
      this.state.descriptions = data.map( elem => {
          return elem.description 
      })
  }))
  };

  render(){
    // console.log(Stocks)
    // console.log(this.state.symbols)
    let filteredSymbols = this.state.symbols.filter((data) => {
      if(this.state.search == null)
        return false
      else if(data.toLowerCase().includes(this.state.search.toLowerCase())){
        return true
      }
      else return false
    }).map((data) => {
      return(
        <div>
          <span 
          onClick = {() => this.handleClick(data)}
          className = 'tooltip'>
            <div className = 'tooltiptext'>Add to Watchlist</div>{data}
            </span>

        </div>
        
      )
    })
    
        return(
            <div className = 
            'home-body'>
                <section className = 'searchcontainer'>
                <input 
                    type = 'text'
                    className = 'searchinput'
                    // value = {this.state.search}
                    placeholder = 'search stocks'
                    onChange ={(e) => this.handleSearch(e)}
                    />
                <button className = 'srchbtn'>Search</button>
                <button 
                  onClick = {this.handleReset}
                  className = 'resetbtn'>Reset</button>
                </section>

                <section className = 'dashboard'>
                </section>

                {filteredSymbols}

            </div>
        )
    }
}
const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(Home);

