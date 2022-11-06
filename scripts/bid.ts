import { ethers } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { AuctionFactory } from "../typechain-types"; 
import * as nftContractJSON from '../artifacts/contracts/EnglishAuction.sol/EnglishAuction.json';
import * as auctionFactoryJSON from '../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json';
import * as mockDaiJSON from '../artifacts/contracts/mockDAI.sol/MockDAI.json';
import { networkConfig } from "../helper-hardhat-config";

dotenv.config();

let auctionFactory: AuctionFactory
let account1: ethers.Wallet;
let account2: ethers.Wallet;
let account3: ethers.Wallet;
let provider: ethers.providers.JsonRpcProvider;

async function main() {

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
