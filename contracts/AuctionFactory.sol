//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {EnglishAuction} from "./EnglishAuction.sol";

contract AuctionFactory {
    EnglishAuction[] public deployedAuctions;
    uint256 private ownerFeePool;
    uint256 public constant creationFee = 10000000000000000; //0.01 ETH

    event AuctionCreated(address Nft, uint256 NftId, uint256 StartingBid, address Seller);


}