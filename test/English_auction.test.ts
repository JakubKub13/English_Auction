import { expect } from "chai";
import { ethers, network } from "hardhat";
import { AuctionFactory, AuctionFactory__factory, EnglishAuction, MockDAI, NFTAuction } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const FACTORY_FEE_FOR_CREATING_AUCTION = 0.1  // ETH in this case
const DAI_AMOUNT_TO_MINT = 1000;
const STARTING_BID = 100; // 100 DAI


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
            expect(await mDAI.symbol()).to.eq("mDAI");
        });

        it("Should deploy NFT", async () => {
            const addressNFT = nft.address;
            expect(await nft.name()).to.eq("NFTauction");
        });

        it("Should deploy AuctionFactory", async () => {
            const addressAucFact = auctionFactory.address;
            const auctionCreationFee = await auctionFactory.creationFee();
            expect(ethers.utils.formatEther(auctionCreationFee)).to.eq("0.100000000000000006");
        });
    });

    describe("Minting NFT to seller and initial supply of DAI for bidders", function () {
        beforeEach(async () => {
            const tx1 = await mDAI.mint(bidder1.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
            await tx1.wait();
            const tx2 = await mDAI.mint(bidder2.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
            await tx2.wait();
            const tx3 = await mDAI.mint(bidder3.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
            await tx3.wait();
            const nftTX = await nft.safeMint(seller.address, "ipfs://carbon_certificate");
            await nftTX.wait();
        });

        it("Should fund bidders with init DAI supply", async () => {
            const bidder1Bal = await mDAI.balanceOf(bidder1.address);
            const bidder2Bal = await mDAI.balanceOf(bidder2.address);
            const bidder3Bal = await mDAI.balanceOf(bidder3.address);
            expect(ethers.utils.formatEther(bidder1Bal)).to.eq("1000.0");
            expect(ethers.utils.formatEther(bidder2Bal)).to.eq("1000.0");
            expect(ethers.utils.formatEther(bidder3Bal)).to.eq("1000.0");
        });

        it("Should mint 1 NFT Certificate to seller", async () => {
            const ownerOfTokenId = await nft.ownerOf(0);
            expect(ownerOfTokenId).to.eq(seller.address);
        });
    });

    describe("Seller can create his own customizable auction for Carbon certificate he owns", function () {
        beforeEach(async () => {
            const tx1 = await mDAI.mint(bidder1.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
            await tx1.wait();
            const tx2 = await mDAI.mint(bidder2.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
            await tx2.wait();
            const tx3 = await mDAI.mint(bidder3.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
            await tx3.wait();
            const nftTX = await nft.safeMint(seller.address, "ipfs://carbon_certificate");
            await nftTX.wait();
            const auctionCreationTx = await auctionFactory.connect(seller).createAuction(
                nft.address,
                0,
                ethers.utils.parseEther(STARTING_BID.toFixed(18)),
                seller.address,
                mDAI.address,
                {value: ethers.utils.parseEther(FACTORY_FEE_FOR_CREATING_AUCTION.toFixed(18))}
            )
            await auctionCreationTx.wait();
            const addressAuction = await auctionFactory.deployedAuctions(0);
            const auctionImplementFactory = await ethers.getContractFactory("EnglishAuction");
            auctionImplementation = auctionImplementFactory.attach(addressAuction)
        });

        it("Should create Auction implementation and deploy it", async() => {
            expect(await auctionImplementation.seller()).to.eq(seller.address);
            expect(await auctionImplementation.nft()).to.eq(nft.address);
            expect(await auctionImplementation.nftId()).to.eq(0);
            const startingBidBn = await auctionImplementation.highestBid();
            const startingBid = ethers.utils.formatEther(startingBidBn);
            expect(startingBid).to.eq("100.0");
            expect(await auctionImplementation.auctionToken()).to.eq(mDAI.address)
        });

        it("Seller can not bid on his own NFT", async () => {
            const bidAmountSeller = 150;
            const approveTx = await nft.connect(seller).approve(auctionImplementation.address, 0);
            await approveTx.wait();
            const startTx = await auctionImplementation.connect(seller).start(10);
            await startTx.wait();
            await expect(auctionImplementation.connect(seller).bid(ethers.utils.parseEther(bidAmountSeller.toFixed(18)))).to.be.revertedWith("Auction: Seller excluded from bidding");
        });

        it("Should not be able to bid when Auction is not started yet", async () => {
            const bidAmount1 = 150;
            await expect(auctionImplementation.connect(bidder1).bid(ethers.utils.parseEther(bidAmount1.toFixed(18)))).to.be.revertedWith("Auction: Is not started yet");
        });

        it("User must approve auction implementation before bid", async () => {
            const bidAmount1 = 150;
            const approveTx = await nft.connect(seller).approve(auctionImplementation.address, 0);
            await approveTx.wait();
            const startTx = await auctionImplementation.connect(seller).start(10);
            await startTx.wait();
            const balance1 = await mDAI.balanceOf(bidder1.address);
            await expect(auctionImplementation.connect(bidder1).bid(ethers.utils.parseEther(bidAmount1.toFixed(18)))).to.be.revertedWith("ERC20: insufficient allowance");
            // const approveTx1 = await mDAI.approve(auctionImplementation.address, balance1);
            // await approveTx1.wait();
        });
    });

    describe("Full test after users Bid", function () {
        beforeEach(async () => {
            const tx1 = await mDAI.mint(bidder1.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
            await tx1.wait();
            const tx2 = await mDAI.mint(bidder2.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
            await tx2.wait();
            const tx3 = await mDAI.mint(bidder3.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
            await tx3.wait();
            const nftTX = await nft.safeMint(seller.address, "ipfs://carbon_certificate");
            await nftTX.wait();
            const auctionCreationTx = await auctionFactory.connect(seller).createAuction(
                nft.address,
                0,
                ethers.utils.parseEther(STARTING_BID.toFixed(18)),
                seller.address,
                mDAI.address,
                {value: ethers.utils.parseEther(FACTORY_FEE_FOR_CREATING_AUCTION.toFixed(18))}
            )
            await auctionCreationTx.wait();
            const addressAuction = await auctionFactory.deployedAuctions(0);
            const auctionImplementFactory = await ethers.getContractFactory("EnglishAuction");
            auctionImplementation = auctionImplementFactory.attach(addressAuction);

            const bidder1Amount = "150";
            const bidder2Amount = "250";
            const bidder3Amount = "350";
            const bidder1NewAmount = "550";
            
            const approveTx = await nft.connect(seller).approve(auctionImplementation.address, 0);
            await approveTx.wait();
            const startTx = await auctionImplementation.connect(seller).start(120);
            await startTx.wait();

            const approveTx1 = await mDAI.connect(bidder1).approve(auctionImplementation.address, ethers.utils.parseEther("1000"));
            const approveTx2 = await mDAI.connect(bidder2).approve(auctionImplementation.address, ethers.utils.parseEther(bidder2Amount));
            const approveTx3 = await mDAI.connect(bidder3).approve(auctionImplementation.address, ethers.utils.parseEther(bidder3Amount));
            await approveTx1.wait();
            await approveTx2.wait();
            await approveTx3.wait();

            const bidTx1 = await auctionImplementation.connect(bidder1).bid(ethers.utils.parseEther(bidder1Amount));
            const bidTx2 = await auctionImplementation.connect(bidder2).bid(ethers.utils.parseEther(bidder2Amount));
            const bidTx3 = await auctionImplementation.connect(bidder3).bid(ethers.utils.parseEther(bidder3Amount));
            await bidTx1.wait();
            await bidTx2.wait();
            await bidTx3.wait();
        });

        it("Bids should not be ended before time has passed", async () => {
            await expect(auctionImplementation.end()).to.be.revertedWith("Auction: Can not be ended yet");
        });

        it("Anyone should be able to end the auction after time has passed", async () => {
            await network.provider.send("evm_increaseTime", [130]);
            await network.provider.send("evm_mine");
            await expect(auctionImplementation.connect(bidder2).end()).to.emit(auctionImplementation, "End");
        });

        it("Highest bidder in your case should be bidder 3", async () => {
            await network.provider.send("evm_increaseTime", [130]);
            await network.provider.send("evm_mine");
            const endTx1 = await auctionImplementation.end();
            await endTx1.wait();
            expect(await auctionImplementation.highestBidder()).to.eq(bidder3.address);
        });

        it("Highest bid should be in our case 350", async () => {
            await network.provider.send("evm_increaseTime", [130]);
            await network.provider.send("evm_mine");
            const endTx1 = await auctionImplementation.end();
            await endTx1.wait();
            const highestBidBn = await auctionImplementation.highestBid();
            const highestBid = ethers.utils.formatEther(highestBidBn);
            expect(highestBid).to.eq("350.0");
        });

        it("Not highest bidders can withdraw and re-bid if want to", async () => {
            const bidder1NewAmount = "550";
            await network.provider.send("evm_increaseTime", [60]);
            await network.provider.send("evm_mine");
            const withdrawTx1 = await auctionImplementation.connect(bidder1).withdraw();
            await withdrawTx1.wait();
            const reBidTx = await auctionImplementation.connect(bidder1).bid(ethers.utils.parseEther(bidder1NewAmount));
            await reBidTx.wait();
            await network.provider.send("evm_increaseTime", [60]);
            await network.provider.send("evm_mine");
            const endTx1 = await auctionImplementation.end();
            await endTx1.wait();
            const highestBidBn = await auctionImplementation.highestBid();
            const highestBid = ethers.utils.formatEther(highestBidBn);
            expect(highestBid).to.eq("550.0");
            expect(await auctionImplementation.highestBidder()).to.eq(bidder1.address);
        });

        it("Should transfer NFT carbon certificate to the highest bidder", async () => {
            await network.provider.send("evm_increaseTime", [130]);
            await network.provider.send("evm_mine");
            const endTx1 = await auctionImplementation.end();
            await endTx1.wait();
            const newOwner = await nft.ownerOf(0);
            expect(newOwner).to.eq(bidder3.address);
        });

        it("Should transfer funds to the seller of the NFT carbon certificate", async () => {
            await network.provider.send("evm_increaseTime", [130]);
            await network.provider.send("evm_mine");
            const endTx1 = await auctionImplementation.end();
            await endTx1.wait();
            const balanceSellerAfterBn = await mDAI.balanceOf(seller.address);
            const balanceSellerAfter = ethers.utils.formatEther(balanceSellerAfterBn);
            const highestBidBn = await auctionImplementation.highestBid();
            const highestBid = ethers.utils.formatEther(highestBidBn);
            expect(balanceSellerAfter).to.eq(highestBid);
        });

        it("Owner of the Auction factory should be able to withdraw ETH from fee pool", async () => {

        });
    });

    describe("Creating Multiple implementations of Auctions with different parameters", function () {
        beforeEach(async () => {

        });
    })


});