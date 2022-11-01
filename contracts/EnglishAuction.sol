//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IERC721} from './interfaces/IERC721.sol';

contract EnglishAuction {
    IERC721 public immutable nft;
    uint256 public immutable nftId;
    address payable public immutable seller;
    uint32 public endAt;
    bool public started;
    bool public ended;
    address public highestBidder;
    uint256 public highestBid;
    mapping(address => uint256) public bids;

    event Start(uint256 stated);
    event Bid(address indexed sender, uint256 amount);
    event Withdraw(address indexed bidder, uint256 amount);
    event End(address highestBidder, uint256 amount);

    constructor(address _nft, uint256 _nftId, uint256 _startingBid) {
        nft = IERC721(_nft);
        nftId = _nftId;
        seller = payable(msg.sender);
        highestBid = _startingBid;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Auction: Not a Seller");
        _;
    }

    modifier notStarted() {
        require(!started, "Auction: Has already started");
        _;
    }

    modifier notEnded() {
        require(!ended, "Auction: Has aleready ended");
        _;
    }

    function start(uint256 _timeInverval) external {
        started = true;
        endAt = uint32(block.timestamp + _timeInverval);
        nft.transferFrom(seller, address(this), nftId);
        emit Start(block.timestamp);
    }

    function bid() external payable {
        require(started, "Auction: Has not started");
        require(block.timestamp < endAt, "Auction: Has already ended");
        require(msg.value > highestBid, "Auction: Value is less than highest Bid");

        if(highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBid = msg.value;
        highestBidder = msg.sender;
        emit Bid(msg.sender, msg.value);
    }

    function withdraw() external {
        uint256 val = bids[msg.sender];
        bids[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: val}("");
        require(success, "Auction: Withdrawing Tx has failed");
        emit Withdraw(msg.sender, val);
    }

    function end() external {
        require(started, "Auction: Has not started");
        require(!ended, "Auction: Was already ended");
        require(block.timestamp >= endAt, "Auction: Can not be ended yet");
        ended = true;
        if (highestBidder != address(0)) {
            nft.transferFrom(address(this), highestBidder, nftId);
            (bool success, ) = seller.call{value: highestBid}("");
            require(success, "Auction: TX to transfer highestBid to seller has failed");
        } else {
            nft.transferFrom(address(this), seller, nftId);
        }
        emit End(highestBidder, highestBid);
    }
}