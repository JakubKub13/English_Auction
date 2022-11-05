import { ethers } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { AuctionFactory, MockDAI, NFTAuction } from "../typechain-types"; 
import { networkConfig } from "../helper-hardhat-config";
dotenv.config();

async function main() {

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });