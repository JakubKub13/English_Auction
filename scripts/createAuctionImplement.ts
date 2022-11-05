import { ethers } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { AuctionFactory, MockDAI, NFTAuction } from "../typechain-types"; 
import { networkConfig } from "../helper-hardhat-config";
dotenv.config();

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
    const privateKey1 = process.env.PRIVATE_KEY;
    const privateKey2 = process.env.PRIVATE_KEY2;
    const privateKey3 = process.env.PRIVATE_KEY3;
    let auctionFactory: AuctionFactory

    const chainId = network.config.chainId;
    const auctionFactoryAddr = networkConfig[chainId]["auctionFactory"];
    const auctionFactory_ABI = [
        "function createAuction(address _nft, uint256 _nftId, uint256 _startingBid, address _seller, address _auctionToken) public payable"
    ];

    const seller = new ethers.Wallet(privateKey2, provider);

    auctionFactory = new ethers.Contract(auctionFactoryAddr, auctionFactory_ABI, provider) as AuctionFactory;

    console.log(auctionFactory.address)

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });