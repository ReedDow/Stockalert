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
            // candle: {},
            candleOpen: [],
            candleClose: [],
            candleHigh: [],
            candleLow: [],
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
        const { candle } = this.state
        let timeStampCurrent = moment().unix()
        let timeStampPast = timeStampCurrent - (336 * 60 * 60)
        finnhubClient.stockCandles(`${symbol}`, "D", `${timeStampPast}`, `${timeStampCurrent}`, {}, (error, data, response) => {
            if (error) { console.log(error) }
            const { c, o, h, l } = data
            this.setState({ candleClose: [ c ] })
            this.setState({ candleOpen: [ o ] })
            this.setState({ candleHigh: [ h ] })
            this.setState({ candleLow: [ l ] })
            this.setState({ toggleCandle: !this.state.toggleCandle })
            console.log(candle)

            return (
                <section>

                </section>
            )

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
                    this.setState({ news: 'No news' })
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
        const { toggleQuote, toggleNews, toggleCandle, quotes, news, candleOpen, candleClose, candleHigh, candleLow, isLoading } = this.state;
        const { symbol } = this.props
        if (isLoading) {
            return (
                <div><img src={loader} className="loader" alt="loader" /></div>
            )
        }
        if (this.state.news.length > 0) {
            console.log(news[0])
            console.log(news[1])
        }
        console.log(candleOpen, candleHigh, candleLow, candleClose)
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
                    <div className='current'>{quotes.c}</div>
                    <div className=
                        'open'>Open: {quotes.o}</div>
                    <div className='high'>Today's High:{quotes.h}</div>
                    <div className='low'>Today's Low: {quotes.l}</div>
                </span>

                <button onClick={() => this.getCandles(symbol.symbol)} className='candle'>Candle
                </button>
                <title className = 'candleTitle'>
                    10 Day Candle Chart
                </title>

                <span style={{ display: toggleCandle ? 'block' : 'none' }}
                    className='candleChart'>
                    <div>
                    </div>

                     <div>
                        {candleOpen.map(item => (
                            <a id='candle'>
                                <div key={item}>< VictoryCandlestick
                                    height={300}
                                    width={400}
                                    candleColors={{ positive: "#00ff00", negative: "#ff0000" }}
                                    data={
                                        [
                                            {
                                                x: moment().format('YYYY, MM, DD'), open: item[0], close: 683, high: 689, low: 654
                                            },
                                            { x: moment().subtract(1, 'days').format('YYYY, MM, DD'), open: item[1], close: 691, high: 693, low: 671 },
                                            { x: moment().subtract(2, 'days').format('YYYY, MM, DD'), open: item[2], close: 716, high: 716, low: 687 },
                                            { x: moment().subtract(3, 'days').format("YYYY, MM, DD"), open: item[3], close: 713, high: 719, low: 709 },
                                            { x: moment().subtract(4, 'days').format("YYYY, MM, DD"), open: item[4], close: 722, high: 724, low: 703 },
                                            { x: moment().subtract(5, 'days').format("YYYY, MM, DD"), open: item[5], close: 694, high: 714, low: 690 },
                                            { x: moment().subtract(6, 'days').format("YYYY, MM, DD"), open: item[6], close: 685, high: 699, low: 683 },
                                            { x: moment().subtract(7, 'days').format("YYYY, MM, DD"), open: item[7], close: 696, high: 704, low: 682 },
                                            { x: moment().subtract(8, 'days').format("YYYY, MM, DD"), open: item[8], close: 706, high: 712, low: 693 },
                                            { x: moment().subtract(9, 'days').format("YYYY, MM, DD"), open: item[9], close: 708, high: 710, low: 700 },
                                        ]}
                                />
                                    {console.log(item)}
                                </div>
                            </a>
                        ))}
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
                        {news.map(item => (
                            <a id='headline' href={item[1]}>
                                <div key={item}>{item[0]}</div>
                            </a>
                        ))}
                    </ul>

                    <ul>
                        {news.map(item => (
                            <a href={item[1]}>
                                <img className='newsImg' src={item[2]} key={item}></img>
                            </a>
                        ))}
                    </ul>
                </span>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(StockItem);