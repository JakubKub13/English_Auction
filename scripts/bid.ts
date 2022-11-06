import { ethers } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { EnglishAuction, MockDAI, NFTAuction } from "../typechain-types"; 
import * as nftContractJSON from '../artifacts/contracts/EnglishAuction.sol/EnglishAuction.json';
import * as auctionFactoryJSON from '../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json';
import * as mockDaiJSON from '../artifacts/contracts/mockDAI.sol/MockDAI.json';
import { networkConfig } from "../helper-hardhat-config";

dotenv.config();

const FIRST_BID = "600";
const SECOND_BID = "1000";

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

  seller = new ethers.Wallet(privateKey2, provider);
  account2 = new ethers.Wallet(privateKey3, provider);
  account3 = new ethers.Wallet(privateKey4, provider);

  const balanceOfAcc1 = await mDAI.connect(account2).balanceOf(account2.address);
  const balanceOfAcc2 = await mDAI.connect(account3).balanceOf(account3.address);

  const approveTx1 = await mDAI.connect(account2).approve(auctionImplementation.address, balanceOfAcc1);
  await approveTx1.wait();
  const approveTx2 = await mDAI.connect(account3).approve(auctionImplementation.address, balanceOfAcc2);
  await approveTx2.wait();

  const bidAcc1TX = await auctionImplementation.connect(account2).bid(ethers.utils.parseEther(FIRST_BID));
  await bidAcc1TX.wait();
  const bidAcc2Tx = await auctionImplementation.connect(account3).bid(ethers.utils.parseEther(SECOND_BID));
  await bidAcc2Tx.wait();

  console.log(`The first bidder: ${account2.address} has bidded with amount of ${FIRST_BID} DAIs`);
  console.log(`The second bidder: ${account3.address} has bidded with amount of ${FIRST_BID} DAIs`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
