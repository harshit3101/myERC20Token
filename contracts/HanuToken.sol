// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract HanuToken {
    
    string public name = "Hanu Token";
    string public symbol = "Hanu";
    string public standard = "Hanu Token v1.0";

    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _intiialSupply) {
        //only internal functions should be called in constructor
        //don't use 'this' here
        //assigning
        balanceOf[msg.sender] = _intiialSupply;
        totalSupply = _intiialSupply;

    }

    //Throw if caller doesn't have funds
    //Transfer funds
    //Trigger transfer Event
    //return boolean
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}