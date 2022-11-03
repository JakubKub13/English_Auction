import { expect } from "chai";
import { ethers, network } from "hardhat";
import { AuctionFactory, EnglishAuction, MockDAI, NFTAuction } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const FACTORY_FEE_FOR_CREATING_AUCTION = 0.1  // ETH in this case

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
        nft = await nftFactory.deploy();
        await nft.deployed();
        auctionFactory = await auctionFactoryFactory.deploy(
            ethers.utils.parseEther(FACTORY_FEE_FOR_CREATING_AUCTION.toFixed(18)) 
        ) as AuctionFactory;
        await auctionFactory.deployed();
    });

    describe("Testing correct initialization", function () {
        it("Should deploy mDAI", async () => {
            const addressDAI = mDAI.address;
            console.log(`Address of deployed DAI token is ${addressDAI}`);
            expect(await mDAI.symbol()).to.eq("mDAI");
        });

        it("Should deploy NFT", async () => {
            const addressNFT = nft.address;
            console.log(`Address of deployed NFT is ${addressNFT}`);
            expect(await nft.name()).to.eq("NFTauction");
        });

        it("Should deploy AuctionFactory", async () => {
            const addressAucFact = auctionFactory.address;
            const auctionCreationFee = await auctionFactory.creationFee();
            console.log(`Address of deployed Auction Factory is ${addressAucFact}`);
            expect(ethers.utils.formatEther(auctionCreationFee)).to.eq("0.100000000000000006");
        });


    });
});