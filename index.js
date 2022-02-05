
require('dotenv-safe').config()

const {MercadoBitcoin} = require('./MercadoBitcoin')
const {MercadoBitcoinTrade} = require('./MercadoBitcoinTrade')

const TIPO_COMPRA   = 1;
const TIPO_VENDA    = 2;

const STATUS_ABERTO    = 2;
const STATUS_CANCELADO = 3;
const STATUS_CONCLUIDA = 4;

var VALOR_ULTIMA_ORDEM = 0.00;

var ultimoValorVenda = 0.00;
var ultimoValorCompra = 99999999999;

var todasOrdensAbertas = [];


const infoApi = new MercadoBitcoin({ currency: (process.env.CURRENCY)})
const tradeApi = new MercadoBitcoinTrade({
    currency: process.env.CURRENCY,
    key: process.env.KEY ,
    secret: process.env.SECRET,
    
})

 async function getQuantity(coin, price, isBuy){
    
    coin = isBuy ? ['brl'] : coin.toLowerCase()
    

    const data = await tradeApi.getAccountInfo()
    const balance = parseFloat(data.balance[coin].available).toFixed(8)  
    if (!isBuy ) return balance;

    //if(balance<1) return false 
    console.log(`saldo disponivel de ${coin}: ${balance}`)

    price = parseFloat(price);
    let qty = parseFloat(balance/price).toFixed(8)
    return qty - 0.00000001
    
} // ????????????????
async function getOrder(){
    const order= await tradeApi.listOrders
    

}
var datetime = new Date();
console.logf("\n===============================================");
console.logf("                  BOT MILIONARIO");
console.logf('Hora:', datetime)  
console.logf("===============================================\n");

setInterval(async() =>{
    
    const response = await infoApi.ticker();
    while( response === false){

        const response = await infoApi.ticker();

    } 
    console.log(response)

    comprar = response.ticker.buy
    vender = response.ticker.sell

    porcentagemCompra = process.env.PERCENTAGECOMPRA
    porcentagemVenda = process.env.PERCENTAGEVENDA
    // spread entre compra e venda no site
   // diferenca= (((vender-comprar)/vender)*100).toFixed(2)
    //console.log('spread de ',diferenca, '%')  


    try {
        // brl em cx pra comprar
        const qty = await getQuantity('BRL',response.ticker.sell, true)
        console.log('meu qty',(qty.toFixed(5)))

            // ***** não ativar ****//
        //if (!qty) return console.error( 'sem saldo')
        //console.log('compra',(qty).toFixed(8), process.env.CURRENCY)

        // Obtem lista de ordens
        const ordersList = await tradeApi.listOrders();
        todasOrdensAbertas = [];
        buscaOrdensAbertas(ordersList)

        // console.log(ordersList);
        var valorVendido = ultimaOrdem(ordersList, TIPO_VENDA);
        var valorComprado = ultimaOrdem(ordersList, TIPO_COMPRA);

        if (vender > ultimoValorVenda ) {
            ultimoValorVenda = vender;
            
        }

        //// revisar////
        
        if (comprar < ultimoValorCompra ) {
            ultimoValorCompra = comprar;
            
        }

        console.log("................................................");
        console.log("Valor da minha ultima venda:    ", valorVendido);
        console.log("Valor da minha ultima compra:   ", valorComprado);
        console.log("................................................");
        console.log("Valor atual venda:    ", vender);
        console.log("Valor atual compra:   ", comprar);
        console.log("................................................");
        console.log("Melhor valor para venda:    ", ultimoValorVenda);
        console.log("Melhor valor para compra:   ", ultimoValorCompra);
        console.log("................................................");
        
           
        // porcentagem que vou vender ( acima do vlr atual)
        const profitability2 = parseFloat(process.env.PROFITABILITY2);

        // porcentagem que vou comprar ( abaixo do vlr atual)
        const profitability = parseFloat(process.env.PROFITABILITY);

        // preço que irei vender
        // const buyPrice = parseFloat(vender*profitability2).toFixed(8);
        // console.log('vendo por', buyPrice)

        // //preço que irei comprar
        // const sellPrice = parseFloat(comprar/profitability).toFixed(8);
        // console.log('compro por', sellPrice)

        // diferença do preço que irei vender e comprar
        // diferencaTrade= (((buyPrice-sellPrice)/buyPrice)*100).toFixed(2)
       
        // cripto em cx para vender
        const sellQty = await getQuantity(process.env.CURRENCY, 20, false)
        console.log('meu saldo em ',process.env.CURRENCY , ' é de: ', sellQty)

        // if(diferenca>0.25){     
        cancelaTodasOrdens()
        if (qty>0.1) {
            
            var difCompra = (((comprar-ultimoValorCompra)/comprar)*100);
            console.log("DIFERENCA COMPRA: "+difCompra.toFixed(2)," %");
            const novoValorCompra = parseFloat(comprar - 0.00000001).toFixed(8);

            const data = await tradeApi.getAccountInfo()
            const balance = parseFloat(data.balance['brl'].available).toFixed(2) 
            const saldo= balance/ valorVendido
            const saldo2 =balance/(ultimoValorCompra +++ultimoValorCompra*(porcentagemCompra/100))
            const tx = 0.003
            
            
            
            console.log('******************************* PIOR CENÁRIO  ',((saldo2-(saldo2*tx))-saldo).toFixed(2), process.env.CURRENCY,'    *********************************' );
           
                if (difCompra >= porcentagemCompra ) {
                    const comprando = await tradeApi.placeBuyOrder(qty, novoValorCompra);
                    console.logf("\n************************************************");
                    console.logf('COMPRAR');
                    console.logf('Ordem inserida no livro ', comprando);
                    console.logf("************************************************\n");

                    ///// pausa de 5 seg
                
                    await sleep(10000)
                    function sleep(ms) {
                    return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                        });
                    } 
                  
                }
                
               
                
        }
        if(sellQty>0.1){
        
            var difVenda= ((ultimoValorVenda-vender)/ultimoValorVenda) * 100;
            console.log("DIFERENCA VENDA: "+difVenda.toFixed(2)," %");
            const novoValorVenda = parseFloat(vender - 0.00000001).toFixed(8);
            console.log("****************PIOR CENÀRIO: ",((sellQty*venda - (sellQty*valorComprado))/0.003).toFixed(2) );
            
            
                if (difVenda >= porcentagemVenda) {
                    
                    const vendendo = await tradeApi.placeSellOrder(sellQty, novoValorVenda )
                    console.logf("\n************************************************");
                    console.logf("VENDER");
                    console.logf('Ordem inserida no livro ', vendendo)  
                    console.logf("************************************************\n");

                    ///// pausa de 5 seg
                    await sleep(10000)
                    function sleep(ms) {
                    return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                         });
                    } 
                }
                
                else {
                    cancelaTodasOrdens()
                }
                       
        }
        else {
            
            console.log('Sem crypto para vender') 

        }
                
        // }
    } catch (error) {
        console.log(error)
              
    }
     
}, process.env.CRAWLER_INTERVAL)


function ultimaOrdem(listaOrdens, tipo) {

    var valorUltimaOrdem = 0.00;
    if (listaOrdens != null && listaOrdens.orders != null &&
        listaOrdens.orders.length > 0) {
        
        orders = [];
        //console.log('List Orders: ', listOrders.orders) 
        if (listaOrdens.orders.forEach == undefined) return;
        var stop = false
        listaOrdens.orders.forEach(function (order) {
            // console.log('LIMIT-PRICE: ', order.executed_price_avg);
            if (order.status == STATUS_CONCLUIDA && order.order_type == tipo && !stop) {
                valorUltimaOrdem = parseFloat(order.executed_price_avg);
                // console.log('Limit Price: ', order.limit_price);
                stop = true;
            }
        });
    }
    return valorUltimaOrdem;
}

function buscaOrdensAbertas(listaOrdens) {

    if (listaOrdens != null && listaOrdens.orders != null &&
        listaOrdens.orders.length > 0) {
        
        //console.log('List Orders: ', listOrders.orders) 
        if (listaOrdens.orders.forEach == undefined) return;
        listaOrdens.orders.forEach(function (order) {
            if (order.status == STATUS_ABERTO) {
                todasOrdensAbertas.push(order.order_id);
            }
        });
    }
}

function cancelaTodasOrdens() {
    if (todasOrdensAbertas.length == 0) { return; }
    console.logf("\n•••••••••••••••••••••••••••••••••••••");
    console.logf("CANCELA ORDEM");
    todasOrdensAbertas.forEach(function (order_id) {
        const result = tradeApi.cancelOrder(order_id);
        console.logf(result);
    });
    console.logf("•••••••••••••••••••••••••••••••••••••\n");
}
 
 
