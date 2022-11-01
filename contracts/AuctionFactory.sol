//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {EnglishAuction} from "./EnglishAuction.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AuctionFactory {
    EnglishAuction[] public deployedAuctions;
    address public owner; 
    uint256 private ownerFeePool;
    uint256 public immutable creationFee;
    

    event AuctionCreated(address Nft, uint256 NftId, uint256 StartingBid, address Seller);
    event FeeWithdrawal(uint256 amount, uint256 time);

    constructor(uint256 _creationFee) {
        owner = msg.sender;
        creationFee = _creationFee;
    }

    function createAuction(address _nft, uint256 _nftId, uint256 _startingBid, address _seller) public payable {
        require(msg.value == creationFee, "Factory: You have not provided required fee");
        EnglishAuction newAuction = 

    }

}