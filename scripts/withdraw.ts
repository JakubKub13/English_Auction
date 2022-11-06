import { ethers } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { EnglishAuction, MockDAI, NFTAuction } from "../typechain-types"; 
import * as auctionImplementationJSON from '../artifacts/contracts/EnglishAuction.sol/EnglishAuction.json';
import { networkConfig } from "../helper-hardhat-config";

dotenv.config();

let auctionImplementation: EnglishAuction
let account2: ethers.Wallet;
let provider: ethers.providers.JsonRpcProvider;

async function main() {
  provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
  const privateKey3 = process.env.PRIVATE_KEY2;
  const chainId = network.config.chainId;
  const auctionImplementationAddr = networkConfig[chainId]["auctionImplementation1"];
  const auctionImplementation_ABI = auctionImplementationJSON.abi;

  auctionImplementation = new ethers.Contract(auctionImplementationAddr, auctionImplementation_ABI, provider) as EnglishAuction;
  account2 = new ethers.Wallet(privateKey3, provider);

  const withdrawTX = await auctionImplementation.connect(account2).withdraw();
  await withdrawTX.wait();

  console.log(`Account with address: ${account2.address} has successfully withdrew his DAIs check you wallet`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
