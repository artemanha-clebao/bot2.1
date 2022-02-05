const axios = require('axios')
const qs = require('querystring')
const crypto = require('crypto')


const ENDPOINT_TRADE_PATH = '/tapi/v3/'
const ENDPOINT_TRADE_API = 'https://www.mercadobitcoin.net' + ENDPOINT_TRADE_PATH

var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.logf = function () {
  console.log(util.format.apply(null, arguments));
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}

class MercadoBitcoinTrade {
    constructor(config){
        this.config ={
            KEY: config.key,
            SECRET: config.secret,
            CURRENCY: config.currency,
            
        }
    //console.log(this.config.CURRENCY)
    }

    getAccountInfo(){
        return this.call('get_account_info',{}) 
        
    }

   // listOrders
   listOrders() {
        return this.call('list_orders',{coin_pair: `BRL${this.config.CURRENCY}`})
   }
        
   //  cancelOrder
   cancelOrder(order_id) {
        return this.call('cancel_order',{coin_pair: `BRL${this.config.CURRENCY}`,
        order_id: `${order_id}`})
   }
    

    placeBuyOrder( qty, limit_price){
        return this.call('place_buy_order',{
            coin_pair: `BRL${this.config.CURRENCY}`,
            quantity: `${qty}`.substring(0,10),
            limit_price: `${limit_price}`
        })

    }

    
    placeSellOrder( qty, limit_price){
        return this.call('place_sell_order',{
            coin_pair: `BRL${this.config.CURRENCY}`,
            quantity: `${qty}`.substring(0,10),
            limit_price: `${limit_price}`
        })

    }

  
    async call(method, parameters){

        const now = new Date().getTime();
        let queryString = qs.stringify({tapi_method: method, tapi_noce: now})
        if (parameters) queryString += `&${qs.stringify(parameters)}`

        const signature = crypto.createHmac('SHA512', this.config.SECRET)
            .update(`${ENDPOINT_TRADE_PATH}?${queryString}`)
            .digest('hex');
        
        const config ={
            headers:{
                'TAPI-ID': this.config.KEY,
                'TAPI-MAC': signature
            }
        }
            
        const response= await axios.post(ENDPOINT_TRADE_API, queryString, config);
    
        if (response.data.error_message) { 
            console.logf("\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            console.logf("Error: ", response.data.error_message);
            console.logf("\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n");
            throw new Error(response.data.error_messege);
        }
        return response.data.response_data
    }  
}




module.exports = {
    MercadoBitcoinTrade
}