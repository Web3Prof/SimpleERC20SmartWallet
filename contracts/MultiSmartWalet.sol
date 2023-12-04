// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Authorizable.sol";

contract MultiSmartWallet is Authorizable, ReentrancyGuard {

    // authorizeable transfer of ERC20 tokens
    function transferERC20(address token, uint256 amount, address receiver) external onlyAuthorized {
        IERC20(token).transfer(receiver, amount);
    }

    // transfer ETH from this wallet, payable address is required to receiver ETH
    function transferETH(uint256 amount, address payable receiver) external nonReentrant onlyAuthorized{
        (bool sent,) = receiver.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // get ERC20 balance
    function getTokenBalance(address token) public view returns(uint256){
        return IERC20(token).balanceOf(address(this));
    }

    // get ETH balance
    function getETHBalance() public view returns(uint256){
        return address(this).balance;
    }

    // to receive eth
    receive() external payable {}

}