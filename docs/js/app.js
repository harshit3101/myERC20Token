App = {

    web3Provider: null,
    web3: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,

    init: async function() {
        $('form').trigger('reset');
        console.log("Hanu App Initialzed");
        const web3 = await getWeb3();
        App.web3 = web3;
        // const accounts = await web3.eth.getAccounts();
        await App.initContracts();
        await App.listenForEvents();
        await App.render();
    },

    initContracts: async function() {

        const hanuTokenSale = await $.getJSON("HanuTokenSale.json");
        App.contracts.HanuTokenSale = TruffleContract(hanuTokenSale);
        App.contracts.HanuTokenSale.setProvider(App.web3Provider);
        App.contracts.HanuTokenSale.deployed().then(function(hanuTokenSaleInstance){
            console.log("Hanu Token Sale address", hanuTokenSaleInstance.address);
        });
         
        
        const hanuToken = await $.getJSON("HanuToken.json");
        App.contracts.HanuToken = TruffleContract(hanuToken);
        App.contracts.HanuToken.setProvider(App.web3Provider);
        App.contracts.HanuToken.deployed().then(function(hanuTokenInstance) {
        console.log("Hanu Token Address:", hanuTokenInstance.address);
        });
    },

    render : async function(){

        if(App.loading) {
            return;
        }
        App.loading = true;

        var loader  = $('#loader');
        var content = $('#content');
    
        loader.show();
        content.hide();

        try{
        const account = await App.web3.eth.getCoinbase();
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);

        //load token sale contract 
        const hanuTokenSale = await App.contracts.HanuTokenSale.deployed();

         //get Token price
        const tokenPrice = await hanuTokenSale.tokenPrice();
        App.tokenPrice = tokenPrice;
        $('.token-price').html(App.web3.utils.fromWei(App.tokenPrice, "ether"));
       
        //tokensSold
        const tokensSold = await hanuTokenSale.tokensSold();
        App.tokensSold = tokensSold.toNumber();

        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);
  
        var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
        $('#progress').css('width', + progressPercent + '%');

        //get available tokens for address
        const hanuToken = await App.contracts.HanuToken.deployed();
        const bal = await hanuToken.balanceOf(App.account);
        $('.dapp-balance').html(bal.toNumber());

        App.loading = false;
        loader.hide();
        content.show();
        }catch(e){
            console.log(e);
        }
    },

    buyTokens: async function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();

        const hanuTokenSale = await App.contracts.HanuTokenSale.deployed();

        const receipt = await hanuTokenSale.buyTokens(numberOfTokens, {
            from: App.account,
            value: numberOfTokens * App.tokenPrice,
            gas: 500000
            });

        console.log("Tokens bought "+receipt);
        $('form').trigger('reset');
        //wait for sell event 
    },

    listenForEvents: async function() {
    
        const hanuTokenSale = await App.contracts.HanuTokenSale.deployed();


        let options = {
            fromBlock: 0,
            toBlock: 'latest'
        };

        hanuTokenSale.Sell(options, async function(err, event){
            console.log("Sell Event Triggered", event);
            await App.render();
        });
    }
}

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          App.web3Provider = window.ethereum;
          try {
            // ask user permission to access his accounts
            await window.ethereum.request({ method: "eth_requestAccounts" });
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        } else {
          reject("must install MetaMask");
        }
      });
    });
};
  
App.init();