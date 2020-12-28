import React, { Component } from 'react';
import { connect } from 'react-redux';
import { VictoryChart, VictoryCandlestick, VictoryAxis, VictoryTheme } from 'victory';
import axios from 'axios';
import moment from 'moment';
import loader from '../../Assets/Images/puff.svg'
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "bsdhv07rh5retdgr9tdg"
const finnhubClient = new finnhub.DefaultApi()

class StockItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toggleQuote: false,
            toggleNews: false,
            toggleCandle: false,
            quotes: {},
            news: [],
            stockData: [],
            isLoading: true,
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 1300)
        // this.getQuotes()
        // this.getNews()
    }

    componentDidUpdate() {
        this.emailAlert()
    }

    emailAlert = () => {
        if ((`${this.state.quotes.h}` - `${this.state.quotes.l}`) / `${this.state.quotes.h}` > .05) {
            axios.post(`/api/email`, { email: this.props.user.email, symbol: this.props.symbol.symbol })
        }
    }

    getCandles = symbol => {
        let timeStampCurrent = moment().unix()
        let timeStampPast = timeStampCurrent - (336 * 60 * 60)
        finnhubClient.stockCandles(`${symbol}`, "D", `${timeStampPast}`, `${timeStampCurrent}`, {}, (error, data, response) => {
            if (error) { console.log(error) }
            const { c, o, h, l } = data
            const dataParse = []
            c.forEach(el => {
                dataParse.push({ close: el })
            })
            dataParse.forEach((el, i) => {
                el.open = o[i]
                el.high = h[i]
                el.low = l[i]
                el.x = moment().subtract(i, 'days').format('YYYY, MM, DD')
            })
            this.setState({ stockData: dataParse })
            this.setState({ toggleCandle: !this.state.toggleCandle })
        });
    };

    getQuotes = symbol => {
        return finnhubClient.quote(`${symbol}`, (error, data, response) => {
            if (error) { console.log(error) }
            const { c, o, h, l } = data
            this.setState({ quotes: { c, o, h, l } })
            this.setState({ toggleQuote: !this.state.toggleQuote })
        });
    }

    getNews = symbol => {
        let date = moment().format("YYYY-MM-DD")

        return finnhubClient.companyNews(`${symbol}`, `${date}`, `${date}`, (error, data, response) => {
            let dataArr = data.slice(0, 5)
            this.state.news = dataArr.map(elem => {
                return elem.dataArr
            })
            if (error) {
                console.log(error);
            } else {
                if (!dataArr[0]) {
                    alert(`No News Retrieved for ${symbol}`)
                    console.log(response.status)
                } else {
                    this.setState({ news: [[dataArr[0].headline, dataArr[0].url, dataArr[0].image], [dataArr[1].headline, dataArr[1].url, dataArr[1].image]] })
                    this.setState({ toggleNews: !this.state.toggleNews })
                }
            }
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
        const { toggleQuote, toggleNews, toggleCandle, quotes, news, stockData, isLoading } = this.state;
        const { symbol } = this.props
        if (isLoading) {
            return (
                <div><img src={loader} className="loader" alt="loader" /></div>
            )
        }
        const renderNews1 = () => {
            if(news){
                return (
                news.map(item => (
                <a id='headline' href={item[1]}>
                    <div key={item}>{item[0]}</div>
                </a>
                )))}else{
                return(
                    <div id='headline'> No News Retrieved for {symbol} </div>
                )}
        }
        const renderNews2 = () => {
            if(news){
                return(
                news.map(item => (
                <a href={item[1]}>
                    <img className='newsImg' src={item[2]} key={item}></img>
                </a>
                )))}else{
                return(
                <img className='newsImg' src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" width="0" height="0" alt="" ></img>
                )}
        }
        console.log(stockData)

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
                        className='btnimg'>
                    </img>
                </button>

                <button onClick={() => this.getQuotes(symbol.symbol)}
                    className='quote'>Quote</button>

                <span style={{ display: toggleQuote ? 'block' : 'none' }}
                    className='fullquote'>
                    <div className='current'>{Math.round((quotes.c + Number.EPSILON) * 100) / 100}</div>
                    <div className=
                        'open'>Open: {Math.round((quotes.o + Number.EPSILON) * 100) / 100}</div>
                    <div className='high'>High: {Math.round((quotes.h + Number.EPSILON) * 100) / 100}</div>
                    <div className='low'>Low: {Math.round((quotes.l + Number.EPSILON) * 100) / 100}</div>
                </span>

                <button onClick={() => this.getCandles(symbol.symbol)} className='candle'>Candle
                </button>
                {/* <title className='candleTitle'>
                    10 Day Candle Chart
                </title> */}

                <span style={{ display: toggleCandle ? 'block' : 'none' }}
                    className='candleChart'>
                    <title className='candleTitle'>
                        10 Day Candle Chart
                    </title>
                    <div>
                        <VictoryChart
                            height={230}
                            width={290}
                            theme={VictoryTheme.material}
                            domainPadding={{ x: 25 }}
                            scale={{ x: "time" }}
                        >
                            {/* <VictoryAxis tickFormat={(t) => `${t.getDate()}/${t.getMonth()}`} /> */}
                            <VictoryAxis dependentAxis />
                            <VictoryCandlestick
                                candleColors={{ positive: "#00ff00", negative: "#ff0000" }}
                                data={stockData}
                            />
                        </VictoryChart>
                        
                    </div>
                </span>

                <button onClick={() => this.getNews(symbol.symbol)}
                    className='news'>News</button>

                <span style={{
                    display: toggleNews ? 'block'
                        : 'none'
                }}
                    className='fullNews'>
                    <ul>
                        {renderNews1()}
                    </ul>
                    <ul>
                        {renderNews2()}
                    </ul>
                </span>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(StockItem);