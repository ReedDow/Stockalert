import axios from 'axios';
var finnhub = require("finnhub")
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "bsdhv07rh5retdgr9tdg" ;
let symbols = [];
const finnhubClient = new finnhub.DefaultApi()


export default function seed() {
    axios.get(finnhubClient.stockSymbols("US", (error, data, response) => {
        symbols = data.map( elem => {
            return elem.symbol 
        })
        console.log(symbols)
        
    }
    ))
    axios.post('/api/symbol', {symbols})
            .then(res => {
                symbols(res.data);
            })
            .catch(err => console.log(err))

    }



