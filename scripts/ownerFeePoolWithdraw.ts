import { ethers } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { AuctionFactory } from "../typechain-types"; 
import * as auctionFactoryJSON from '../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json';
import { networkConfig } from "../helper-hardhat-config";

dotenv.config();

const FACTORY_FEE: Number = 0.03;

let auctionFactory: AuctionFactory
let factoryOwner: ethers.Wallet;
let provider: ethers.providers.JsonRpcProvider;

async function main() {
    provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
    const privateKey = process.env.PRIVATE_KEY;
    const chainId = network.config.chainId;
    const auctionFactAddr = networkConfig[chainId]["auctionFactory"];
    const auctionFact_ABI = auctionFactoryJSON.abi;

    auctionFactory = new ethers.Contract(auctionFactAddr, auctionFact_ABI, provider) as AuctionFactory;
    factoryOwner = new ethers.Wallet(privateKey, provider);

    const balanceOwnerBeforeBn = await provider.getBalance(factoryOwner.address);
    const balanceOwnerBefore = ethers.utils.formatEther(balanceOwnerBeforeBn);
    console.log(`Balance of the owner address: ${factoryOwner.address} is ${balanceOwnerBefore} MATIC/ETH`);

    const feeWithdrawTx = await auctionFactory.connect(factoryOwner).ownerFeeWithdraw(factoryOwner.address, await auctionFactory.connect(factoryOwner).ownerFeePool());
    await feeWithdrawTx.wait();

    const balanceOwnerAfterBn = await provider.getBalance(factoryOwner.address);
    const balanceOwnerAfter = ethers.utils.formatEther(balanceOwnerAfterBn);

    console.log(`Balance of the owner address: ${factoryOwner.address} is ${balanceOwnerAfter} MATIC/ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
