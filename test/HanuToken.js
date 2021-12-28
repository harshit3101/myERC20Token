const HanuToken = artifacts.require("HanuToken");

contract("HanuToken", function(accounts) {
    // if("sets the total supply upon deployment", async () => {
    //     const token = await HanuToken.deployed();
    //     let totalSupply = await token.totalSupply();
    //     assert.equal(totalSupply.toNumber(),1000000);
    // });

    it("sets the total supply upon deployment", function() {
        return HanuToken.deployed().then(function(tok) {
          token = tok;
          return token.totalSupply();
        }).then(function(totalSupply) {
          assert.equal(totalSupply.toNumber(), 1000000);
          return token.balanceOf(accounts[0]);
        }).then(function(adminBal) {
            assert.equal(adminBal.toNumber(), 1000000, 'Supply is allocated to admin bal');
        });
    });

    it("intialzes the contract with correct inputs", function() {
        return HanuToken.deployed().then(function(tok) {
          token = tok;
          return token.name();
        }).then(function(name) {
          assert.equal(name, 'Hanu Token', 'Correct name');
          return token.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, 'Hanu', 'Correct symbol');
            return token.standard();
        }).then(function(standard){
            assert.equal(standard, 'Hanu Token v1.0', 'Correct standard');
        });
    });

    it("transfers tokens ownership", function() {
        return HanuToken.deployed().then(function(tok) {
          token = tok;
          return token.transfer.call(accounts[1], 99999999999999);
        }).then(assert.fail).catch(function(error) {
            assert(error.message.toString().indexOf('revert') >=0, 'error msg must contains revert');
            return token.transfer.call(accounts[1], 25000, {from: accounts[0]});
        }).then(function(res){
            assert.equal(res, true, 'Call should returns true')
            return token.transfer(accounts[1], 25000, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 25000, 'logs the transfer amount');
            return token.balanceOf(accounts[1]);
        }).then(function(bal){
            assert.equal(bal.toNumber(), 25000, 'Amount not correct in the receving acount');
            return token.balanceOf(accounts[0]);
        }).then(function(bal){
            assert.equal(bal.toNumber(), (1000000-25000), 'Amount not deducted correctly in the sender acount');
        });
    });


})


