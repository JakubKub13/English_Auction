import { ethers } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { EnglishAuction, MockDAI, NFTAuction } from "../typechain-types"; 
import * as auctionImplementationJSON from '../artifacts/contracts/EnglishAuction.sol/EnglishAuction.json';
import * as nftContractJSON from '../artifacts/contracts/NFT.sol/NFTAuction.json';
import * as mockDaiJSON from '../artifacts/contracts/mockDAI.sol/MockDAI.json';
import { networkConfig } from "../helper-hardhat-config";

dotenv.config();

let carbonNFT: NFTAuction;
let mDAI: MockDAI;
let auctionImplementation: EnglishAuction
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
  const auctionImplementation_ABI = auctionImplementationJSON.abi;
  const mDAIAddr = networkConfig[chainId]["mDAI"];
  const mDAI_ABI = mockDaiJSON.abi;

  carbonNFT = new ethers.Contract(NFTAddr, NFT_ABI, provider) as NFTAuction;
  auctionImplementation = new ethers.Contract(auctionImplementationAddr, auctionImplementation_ABI, provider) as EnglishAuction;
  mDAI = new ethers.Contract(mDAIAddr, mDAI_ABI, provider) as MockDAI;

  seller = new ethers.Wallet(privateKey2, provider);
  account2 = new ethers.Wallet(privateKey3, provider);
  account3 = new ethers.Wallet(privateKey4, provider);

  const endTx = await auctionImplementation.connect(seller).end();
  await endTx.wait();

  const highestBidder = await auctionImplementation.connect(seller).highestBidder();
  const highestBidBn = await auctionImplementation.connect(seller).highestBid();
  const highestBid = ethers.utils.formatEther(highestBidBn);


  console.log(`The Auction was ended !!!!!!! `)
  console.log("-------------------------------------------")
  console.log(`Highest bidder of auction is address: ${highestBidder}`);
  console.log(`Highest bid is ${highestBid} DAIs`)

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
