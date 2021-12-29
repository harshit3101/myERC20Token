const HanuTokenSale = artifacts.require("HanuTokenSale");

contract("HanuTokenSale", function(accounts) {


    //in wei
    tokenPrice=1000000000000000;

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

});