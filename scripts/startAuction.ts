import { ethers } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { EnglishAuction, NFTAuction } from "../typechain-types"; 
import * as nftContractJSON from '../artifacts/contracts/NFT.sol/NFTAuction.json';
import * as auctionImplementationJSON from '../artifacts/contracts/EnglishAuction.sol/EnglishAuction.json';
import { networkConfig } from "../helper-hardhat-config";

dotenv.config();

const DURATION_OF_AUCTION_IN_SEC = 300 // 5 minutes

let carbonNFT: NFTAuction;
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

  carbonNFT = new ethers.Contract(NFTAddr, NFT_ABI, provider) as NFTAuction;
  auctionImplementation = new ethers.Contract(auctionImplementationAddr, auctionImplementation_ABI, provider) as EnglishAuction;
  seller = new ethers.Wallet(privateKey2, provider);
  account2 = new ethers.Wallet(privateKey3, provider);
  account3 = new ethers.Wallet(privateKey4, provider);

  const approveTx = await carbonNFT.connect(seller).approve(auctionImplementationAddr, 0);
  await approveTx.wait();

  const startTx = await auctionImplementation.connect(seller).start(DURATION_OF_AUCTION_IN_SEC);
  await startTx.wait();

  const currentBlock = await provider.getBlock("latest");
  const currentTime = currentBlock.timestamp

  const started = await auctionImplementation.connect(account2).started();
  const endAt = await auctionImplementation.connect(account3).endAt();

  console.log(`The state started in auction implementation is: ${started} current timestamp is : ${currentTime} auction will terminate at ${endAt}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
