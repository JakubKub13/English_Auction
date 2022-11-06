import { ethers } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { EnglishAuction, MockDAI, NFTAuction } from "../typechain-types"; 
import * as nftContractJSON from '../artifacts/contracts/EnglishAuction.sol/EnglishAuction.json';
import * as auctionFactoryJSON from '../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json';
import * as mockDaiJSON from '../artifacts/contracts/mockDAI.sol/MockDAI.json';
import { networkConfig } from "../helper-hardhat-config";

dotenv.config();

const FIRST_BID = 600;
const SECOND_BID = 1000;
const THIRD_BID = 2500;

let carbonNFT: NFTAuction;
let auctionImplementation: EnglishAuction
let mDAI: MockDAI
let seller: ethers.Wallet;
let account2: ethers.Wallet;
let account3: ethers.Wallet;
let provider: ethers.providers.JsonRpcProvider;

async function main() {
  provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
  const privateKey2 = process.env.PRIVATE_KEY2;
  const privateKey3 = process.env.PRIVATE_KEY3;
  const privateKey4 = process.env.PRIVATE_KEY4;
  const chainId = network.config.chainId;
  const NFTAddr = networkConfig[chainId]["NFT"];
  const NFT_ABI = nftContractJSON.abi;
  const auctionImplementationAddr = networkConfig[chainId]["auctionImplementation1"];
  const auctionImplementation_ABI = auctionFactoryJSON.abi;
  const mDAIAddr = networkConfig[chainId]["mDAI"];
  const mDAI_ABI = mockDaiJSON.abi;

  carbonNFT = new ethers.Contract(NFTAddr, NFT_ABI, provider) as NFTAuction;
  mDAI = new ethers.Contract(mDAIAddr, mDAI_ABI, provider) as MockDAI;
  auctionImplementation = new ethers.Contract(auctionImplementationAddr, auctionImplementation_ABI, provider) as EnglishAuction;
  

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
