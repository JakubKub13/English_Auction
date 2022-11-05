import { ethers } from "ethers";
import { network } from "hardhat";
import * as dotenv from "dotenv";
import { AuctionFactory, MockDAI, NFTAuction } from "../typechain-types"; 
import { networkConfig } from "../helper-hardhat-config";

dotenv.config();

const STARTING_BID: Number = 500; // DAI
const FACTORY_FEE: Number = 0.03; // ETH or Matic

let auctionFactory: AuctionFactory
let account1: ethers.Wallet;
let account2: ethers.Wallet;
let account3: ethers.Wallet;
let provider: ethers.providers.JsonRpcProvider;

async function main() {
    provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
    const privateKey2 = process.env.PRIVATE_KEY2;
    const privateKey3 = process.env.PRIVATE_KEY3;
    const privateKey4 = process.env.PRIVATE_KEY4;
    const chainId = network.config.chainId;
    const mDAIAddr = networkConfig[chainId]["mDAI"];
    const NFTAddr = networkConfig[chainId]["NFT"];
    const auctionFactAddr = networkConfig[chainId]["auctionFactory"];
    const auctionFactory_ABI = [
        {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_creationFee",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "Nft",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "NftId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "StartingBid",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "Seller",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "chosenAuctionToken",
                "type": "address"
              }
            ],
            "name": "AuctionCreated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
              }
            ],
            "name": "FeeWithdrawal",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_nft",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_nftId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_startingBid",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_seller",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_auctionToken",
                "type": "address"
              }
            ],
            "name": "createAuction",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "creationFee",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "deployedAuctions",
            "outputs": [
              {
                "internalType": "contract EnglishAuction",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "ownerFeePool",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_to",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              }
            ],
            "name": "ownerFeeWithdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
    ];

    auctionFactory = new ethers.Contract(auctionFactAddr, auctionFactory_ABI, provider) as AuctionFactory;
    account1 = new ethers.Wallet(privateKey2, provider);
    account2 = new ethers.Wallet(privateKey3, provider);
    account3 = new ethers.Wallet(privateKey4, provider);

    const createTx = await auctionFactory.connect(account1).createAuction(
        NFTAddr,
        0,
        ethers.utils.parseEther(STARTING_BID.toFixed(18)),
        account1.address,
        mDAIAddr,
        {value: ethers.utils.parseEther(FACTORY_FEE.toFixed(18))}
    );

    await createTx.wait();
    const auctionImplementationAddr = await auctionFactory.connect(account1).deployedAuctions(0);

    console.log("------------------------------New Auction created --------------------------------!!!!!");
    console.log(`The address of new Auction is ${auctionImplementationAddr}`);
    console.log(`The seller of the certificate is ${account1.address}`);
    console.log(`The address of nft carbon certificate is ${NFTAddr} and tokenId is 0`);
    console.log(`Selected token for payment is mDAI at the address of ${mDAIAddr}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });