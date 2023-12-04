// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Authorizable is Ownable {

    mapping(address => bool) public authorized;
    
    modifier onlyAuthorized {
        require(authorized[msg.sender] || owner() == msg.sender, "Unauthorized access");
        _;
    }

    function addAuthorized(address _address) onlyOwner public {
        require(_address != address(0));
        authorized[_address] = true;
    }

    function removeAuthorized(address _address) onlyOwner public {
        require(_address != address(0));
        require(_address != msg.sender);
        authorized[_address] = false;
    }

}
