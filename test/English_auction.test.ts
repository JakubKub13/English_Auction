import { expect } from "chai";
import { ethers, network } from "hardhat";
import { AuctionFactory, EnglishAuction } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const TOKEN_NAME: string "mockDAI";
const TOKEN_SYMBOL: string "mDAI";