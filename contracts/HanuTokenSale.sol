// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;
import "./HanuToken.sol";

contract HanuTokenSale {
    address admin;
    HanuToken public tokenContract;

    //in Wei
    uint256 public tokenPrice;

    constructor(HanuToken _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}