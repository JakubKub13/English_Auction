export interface networkConfigItem {
    name?: string
    auctionFactory?: string 
    auctionImplementation1?: string
    auctionImplementation2?: string
    auctionImplementation3?: string
    mDAI?: string
    NFT?: string
  }
export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
        auctionFactory: "",
        auctionImplementation: "",
        mDAI: "",
        NFT: "",
    },

    5: {
        name: "goerli",
        auctionFactory: "",
        auctionImplementation: "",
        mDAI: "",
        NFT: "",
    },

    80001: {
        name: "mumbai",
        auctionFactory: "0xF5d54B73285f6534B38E76527B3c7aF2e75C986e",
        auctionImplementation1: "0x25F5564c723cBd200bB2992656ad6ba9b2Ce4A59",
        auctionImplementation2: "",
        auctionImplementation3: "",
        mDAI: "0x9b3F64417666A1AaD87Efe0AB1Ce8c28D9cDb2e1",
        NFT: "0x277Dfd8695646BD80bf3210841Ace1dF9F02E1DD",
    },

    1: {
        name: "mainnet",
        auctionFactory: "",
        auctionImplementation: "",
        mDAI: "",
        NFT: "",
    },
}

export const developmentChains = ["hardhat", "localhost"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6