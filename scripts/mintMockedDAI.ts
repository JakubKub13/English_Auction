import { ethers, Wallet } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { MockDAI } from "../typechain-types"; 
import { networkConfig } from "../helper-hardhat-config";

dotenv.config();

let mDAI: MockDAI;
let minter: ethers.Wallet;
let account1: ethers.Wallet;
let account2: ethers.Wallet;
let account3: ethers.Wallet;
let provider: ethers.providers.JsonRpcProvider;

const DAI_AMOUNT_TO_MINT = 1000;

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
    const privateKey1 = process.env.PRIVATE_KEY;
    const privateKey2 = process.env.PRIVATE_KEY2;
    const privateKey3 = process.env.PRIVATE_KEY3;
    const privateKey4 = process.env.PRIVATE_KEY4;

    let mockedDAI: MockDAI;

    const chainId = network.config.chainId;
    const mDAIAddr = networkConfig[chainId]["mDAI"];
    const mDAI_ABI = [
        "function mint(address to, uint256 amount) public onlyOwner"
    ];

    mDAI = new ethers.Contract(mDAIAddr, mDAI_ABI, provider) as MockDAI;
    minter = new ethers.Wallet(privateKey1, provider);
    account1 = new ethers.Wallet(privateKey2, provider);
    account2 = new ethers.Wallet(privateKey3, provider);
    account3 = new ethers.Wallet(privateKey4, provider);

    const mintTx1 = await mDAI.connect(minter).mint(account1.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
    await mintTx1.wait();
    const mintTx2 = await mDAI.connect(minter).mint(account2.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
    await mintTx2.wait();
    const mintTx3 = await mDAI.connect(minter).mint(account3.address, ethers.utils.parseEther(DAI_AMOUNT_TO_MINT.toFixed(18)));
    await mintTx3.wait();

    const acc1BalAfterBn = await mDAI.connect(account1).balanceOf(account1.address);
    const acc2BalAfterBn = await mDAI.connect(account2).balanceOf(account2.address);
    const acc3BalAfterBn = await mDAI.connect(account3).balanceOf(account3.address);
    const acc1BalAfter = ethers.utils.formatEther(acc1BalAfterBn);
    const acc2BalAfter = ethers.utils.formatEther(acc2BalAfterBn);
    const acc3BalAfter = ethers.utils.formatEther(acc3BalAfterBn);

    console.log(`Balance of Account 1 after mint is ${acc1BalAfter} MockedDAI`);
    console.log(`Balance of Account 2 after mint is ${acc2BalAfter} MockedDAI`);
    console.log(`Balance of Account 3 after mint is ${acc3BalAfter} MockedDAI`);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });