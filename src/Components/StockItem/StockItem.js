import React, { Component } from 'react';
import axios from 'axios';
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "bsdhv07rh5retdgr9tdg"
const finnhubClient = new finnhub.DefaultApi()

class StockItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toggle: false,
            quotes: {},
        }
    }

    componentDidUpdate(){
        this.emailAlert()
    }

    emailAlert = () => {
        if((`${this.state.quotes.h}`-`${this.state.quotes.l}`)/`${this.state.quotes.h}`> .05){
        axios.post(`/api/email`,{email: this.props.user.email, symbol: this.state.symbol.symbol})
        }
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
        this.props.getStocks();
    })
    .catch(err => console.log(err))
}

    render() {
        const {symbol}=this.props
        return (
            <div
                key={symbol.symbol}
                className='symbol-box'>
                <span className='symbol'>
                    {symbol.symbol}
                </span>

                <button className='deletebtn1' onClick={() => this.deleteSymbol(symbol.stock_id)}>
                    <img 
                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSxE-diSWIaqD3s2eKjTQVPDrHYCuX0OjqDIQ&usqp=CAU'
                        alt='delete from watchlist'
                        className = 'btnimg'>
                    </img>
                    </button>

                <button onClick={() => this.getQuotes(symbol.symbol)}
                    className='quote'>Quote</button>

                <span style={{ display: this.state.toggle ? 'block' : 'none' }}
                    className='fullquote'>
                    <div className='current'>{this.state.quotes.c}</div>
                    <div className=
                        'open'>Open: {this.state.quotes.o}</div>
                    <div className='high'>Today's High:{this.state.quotes.h}</div>
                    <div className='low'>Today's Low: {this.state.quotes.l}</div>
                </span>


                {/* <button onClick={() => this.getNews(symbol.symbol)}
                    className='news'>News</button> */}
                {/* <span>{this.state.news}</span> */}

            </div>

        )
    }

}

export default StockItem