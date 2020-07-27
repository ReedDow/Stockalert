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
            quotes: [],
            symbols: [],
            filteredSymbols: [],
            search: null,

        }
    }

  componentDidMount(){
    this.getSymbols()
  }

  handleSearch = (event) => {
    let keyword = event.target.value;
    this.setState({search: keyword})
  };

  handleReset = () =>{
    this.setState({search: null})
  };

  getSymbols = () => {
    axios.get(finnhubClient.stockSymbols("US", (error, data, response) => {
      this.state.symbols = data.map( elem => {
          return elem.symbol 
      })
      // console.log(this.state.symbols)
  }))
  };

  getQuotes = () => {
    axios.get('https://finnhub.io/api/v1/quote?symbol=AAPL&token=bsdhv07rh5retdgr9tdg', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
})
};

  render(){
    console.log(this.state.symbols)
    let filteredSymbols = this.state.symbols.filter((data) => {
      if(this.state.search == null)
        return false
      else if(data.toLowerCase().includes(this.state.search.toLowerCase())){
        return true
      }
      else return false
    }).map(data => {
      return(
        <div>
          <container className = 'container'>{data}</container>
          <button className = 'button'>Add to Watchlist</button>
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
                <h6>Stocks</h6>
                </section>

                {filteredSymbols}

            </div>
        )
        
    }
}
const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(Home);

