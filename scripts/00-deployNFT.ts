import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { NFTAuction } from "../typechain-types";
dotenv.config();



async function main() {
    let nft: NFTAuction;

    const nftFactory = await ethers.getContractFactory("NFTAuction");
    nft = await nftFactory.deploy() as NFTAuction;
    await nft.deployed();

    console.log(`Mocked NFT was deployed at this address: ${nft.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});