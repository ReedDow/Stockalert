import React, { Component } from 'react';
import { connect } from 'react-redux';
import {VictoryChart, VictoryCandlestick, VictoryAxis, VictoryTheme} from 'victory';
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
            candle: {},
            isLoading: true,
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 2000)
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
        let timeStampPast = timeStampCurrent - (168 * 60 * 60)
        finnhubClient.stockCandles(`${symbol}`, "D", `${timeStampPast}`, `${timeStampCurrent}`, {}, (error, data, response) => {
            if (error) { console.log(error) }
            const { c, o, h, l } = data
            this.setState({ candle: { c, o, h, l } })
            this.setState({ toggleCandle: !this.state.toggleCandle })
            console.log(this.state.candle)

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
                    this.setState({ news: [dataArr[0].headline, dataArr[0].url, dataArr[0].image] })
                    // this.setState({ news: [[dataArr[0].headline, dataArr[0].url, dataArr[0].image], [dataArr[1].headline, dataArr[1].url, dataArr[1].image]] })
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
        if (this.state.isLoading) {
            return (
                <div><img src={loader} className="loader" alt="loader" /></div>
            )
        }
        const { toggleQuote, toggleNews, toggleCandle, quotes, news, candle } = this.state;
        const { symbol } = this.props
        console.log(news)
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

                <button onClick={() => this.getCandles(symbol.symbol)} className='candle'>Candle</button>

                < VictoryCandlestick
                    candleData={
                        [
                            { x: new Date(moment().format("YYYY, MM, DD")), open: candle.o[0], close: candle.c[0], high: candle.h[0], low: candle.l[0] },
                            { x: new Date(2016, 6, 2), open: candle.o[1], close: candle.c[1], high: candle.h[1], low: candle.l[1] },
                            { x: new Date(2016, 6, 3), open: candle.o[2], close: candle.c[2], high: candle.h[2], low: candle.l[2] },
                            { x: new Date(2016, 6, 4), open: candle.o[3], close: candle.c[3], high: candle.h[3], low: candle.l[3] },
                            { x: new Date(2016, 6, 5), open: candle.o[4], close: candle.c[4], high: candle.h[4], low: candle.l[4] }
                        ]}
                />
                <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ x: 25 }}
                    scale={{ x: "time" }}
                >
                    <VictoryAxis tickFormat={(t) => `${t.getDate()}/${t.getMonth()}`} />
                    <VictoryAxis dependentAxis />
                    <VictoryCandlestick
                        candleColors={{ positive: "#5f5c5b", negative: "#c43a31" }}
                        data={this.props.candleData}
                    />
                </VictoryChart>

                <button onClick={() => this.getNews(symbol.symbol)}
                    className='news'>News</button>

                <span style={{
                    display: toggleNews ? 'block'
                        : 'none'
                }}
                    className='fullNews'>


                    <a
                        style={{ display: news[0] }} href={news[1]} target="_blank"
                        rel="noopener noreferrer"
                        className='headline'>{(news[2])}
                    </a>

                    <a href={news[1]}>
                        <img src={news[2]}
                            alt={news[1]}
                            className='newsImg'
                        ></img>
                    </a>

                    {/* <a
                            style={{ display: news[[1][0]] }} href={news[[1][1]]} target="_blank"
                            rel="noopener noreferrer"
                            className='headline2'>{(news[[1][0]])}
                        </a>

                        {/* <a href={news[[1][0]]}>
                            <img src={news[[1][0]]}
                                alt={news[[1][0]]}
                                className='newsImg2'
                            ></img>
                        </a> */}


                </span>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(StockItem);