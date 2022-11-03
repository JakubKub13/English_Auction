import { expect } from "chai";
import { ethers, network } from "hardhat";
import { AuctionFactory, EnglishAuction, MockDAI, NFTAuction } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("English Auction for tokenized carbon credits", function () {
    let mDAI: MockDAI;
    let nft: NFTAuction;
    let auctionFactory: AuctionFactory;
    let auctionImplementation: EnglishAuction;
    let deployer: SignerWithAddress;
    let seller: SignerWithAddress;
    let bidder1: SignerWithAddress;
    let bidder2: SignerWithAddress;
    let bidder3: SignerWithAddress;

    beforeEach(async function() {
        
    })
});