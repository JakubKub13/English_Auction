import { expect } from "chai";
import { ethers, network } from "hardhat";
import { AuctionFactory, EnglishAuction, MockDAI, NFTAuction } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("English Auction for tokenized carbon credits", function () {
    let mDAI: MockDAI;
    let nft: NFTAuction;
    let auctionFactory: AuctionFactory;
    let auctionImplementation: EnglishAuction;
    let owner: SignerWithAddress;
    let seller: SignerWithAddress;
    let bidder1: SignerWithAddress;
    let bidder2: SignerWithAddress;
    let bidder3: SignerWithAddress;

    beforeEach(async function() {
        [owner, seller, bidder1, bidder2, bidder3] = await ethers.getSigners();
        const mDAIFactory = await ethers.getContractFactory("MockDAI");
        const nftFactory = await ethers.getContractFactory("NFTAuction");
        const auctionFactoryFactory = await ethers.getContractFactory("AuctionFactory");
        const auctionImplementFactory = await ethers.getContractFactory("EnglishAuction");
        mDAI = await mDAIFactory.deploy();
        await mDAI.deployed();


    })
});