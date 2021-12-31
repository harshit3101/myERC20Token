// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;
import "./HanuToken.sol";
import "./utils/math/SafeMath.sol";

contract HanuTokenSale {
    address admin;
    HanuToken public tokenContract;

    using SafeMath for uint256;

    //in Wei
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address indexed _buyer, 
        uint256 _amount);
    

    constructor(HanuToken _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    //multiply

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == _numberOfTokens.mul(tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        //requrie that a transfer is succesfull
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin,tokenContract.balanceOf(address(this))));
        // selfdestruct(payable(msg.sender));
    }

    function sendAllBalance() public {
        require(msg.sender == admin);
        payable(admin).transfer(address(this).balance);
    }
}