import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { AuctionFactory } from "../typechain-types";
dotenv.config();

async function main() {
    let auctionFactory: AuctionFactory;
    const FACTORY_FEE_FOR_CREATING_AUCTION: Number = 0.03;   

    const auctionFactFactory = await ethers.getContractFactory("AuctionFactory");
    auctionFactory = await auctionFactFactory.deploy(
        ethers.utils.parseEther(FACTORY_FEE_FOR_CREATING_AUCTION.toFixed(18))
    );
    await auctionFactory.deployed();
    console.log(`Auction Factory was deployed at this address: ${auctionFactory.address}`);
    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});