import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MockDAI } from "../typechain-types";
dotenv.config();

async function main() {
    let mDai: MockDAI;

    const mDAIFactory = await ethers.getContractFactory("MockDAI");
    mDai = await mDAIFactory.deploy() as MockDAI;
    await mDai.deployed();

    console.log(`Mocked DAI was deployed at address of: ${mDai.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});