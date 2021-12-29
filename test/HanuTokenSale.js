const HanuTokenSale = artifacts.require("HanuTokenSale");
const HanuToken = artifacts.require("HanuToken");

contract("HanuTokenSale", function(accounts) {

    //in wei
    tokenPrice=1000000000000000;
    admin = accounts[0];
    buyer = accounts[1];
    tokensAvailable = 7500;

    it("intializes the contract with correct values upon deployment", function() {
        return HanuTokenSale.deployed().then(function(tok) {
          tokenSale = tok;
          return tokenSale.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, 'Has contract address');
            return tokenSale.tokenContract();
        }).then(function(tokenContract){
            assert.notEqual(tokenContract, 0x0, 'Has tokenContract address');
            return tokenSale.tokenPrice();
        }).then(function(price){
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });

    it("facilititates token buying", function() {
        return HanuToken.deployed().then(function(tokenHanu){
            token = tokenHanu;
            return HanuTokenSale.deployed();
        }).then(function(tok) {
          tokenSale = tok;
          return token.transfer(tokenSale.address, tokensAvailable, {from: admin});
        }).then(function(receipt) {
          numberOfTokens = 100;
          amountInWei = numberOfTokens*tokenPrice;
          return tokenSale.buyTokens(numberOfTokens, {from: buyer, value: amountInWei});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
            return tokenSale.tokensSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
            return tokenSale.buyTokens(numberOfTokens, {from: buyer, value: 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert')>=0, 'msg.value in wei must equal to actual value of no. of tokens');
            return tokenSale.buyTokens(8000, {from: buyer, value: 8000*tokenPrice});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0, 'number of tokens purchased can not be more than avaible in conrtact');
            return tokenSale.buyTokens(80, {from: buyer, value: 80*tokenPrice});
        }).then(function(receipt){
            return token.balanceOf(tokenSale.address);
        }).then(function(bal){
            assert.equal(bal.toNumber(), tokensAvailable-numberOfTokens-80, 'Number tokens available decreases');
            
        });
    }); 

});