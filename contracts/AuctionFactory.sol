//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {EnglishAuction} from "./EnglishAuction.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AuctionToken} from "./AuctionToken.sol";

contract AuctionFactory is Ownable {
    EnglishAuction[] public deployedAuctions;
    AuctionToken public auctionEther;
    uint256 public ownerFeePool;
    uint256 public immutable creationFee;
    
    event AuctionCreated(address Nft, uint256 NftId, uint256 StartingBid, address Seller);
    event TokenMinted(address _from, address _to, uint256 _amount);
    event FeeWithdrawal(address to, uint256 amount, uint256 time);
    event TokenBurnt(address _from, address _to, uint256 _amount);

    constructor(uint256 _creationFee, string memory _name, string memory _symbol) {
        auctionEther = new AuctionToken(_name, _symbol);
        creationFee = _creationFee;
    }

    function createAuction(address _nft, uint256 _nftId, uint256 _startingBid, address _seller) public payable {
        require(msg.value == creationFee, "Factory: You have not provided required fee");
        ownerFeePool += msg.value;
        EnglishAuction newAuction = new EnglishAuction(_nft, _nftId, _startingBid, _seller);
        deployedAuctions.push(newAuction);
        emit AuctionCreated(_nft, _nftId, _startingBid, _seller);
    }

    function purchaseAuctionTokens() public payable {
        auctionEther.mint(msg.sender, msg.value); // ration 100 Auction tokens for 1 eth 
        emit TokenMinted(address(0), msg.sender, msg.value);
    }

    function burnAuctionTokens(uint256 _amount) public {
        auctionEther.burnFrom(msg.sender, _amount);
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Auction Factory: Fails burning tokens and returning Ethers");
        emit TokenBurnt(msg.sender, address(0), _amount);
    }

    function ownerFeeWithdraw(address _to, uint256 _amount) public onlyOwner {
        require(_amount <= ownerFeePool, "Factory: Can not withdraw more money then available in Fee Pool");
        ownerFeePool -= _amount;
        (bool success, ) = payable(_to).call{value: _amount}("");
        require(success, "Factory: Tx has failed try again");
        emit FeeWithdrawal(_to, _amount, block.timestamp);
    }
}