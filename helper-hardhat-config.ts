export interface networkConfigItem {
    name?: string
    auctionFactory?: string 
    auctionImplementation?: string
  }
export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
        auctionFactory: "",
        auctionImplementation: "",
    },

    5: {
        name: "goerli",
        auctionFactory: "",
        auctionImplementation: "",
    },

    80001: {
        name: "mumbai",
        auctionFactory: "",
        auctionImplementation: "",
    },

    1: {
        name: "mainnet",
        auctionFactory: "",
        auctionImplementation: "",
    },
}

export const developmentChains = ["hardhat", "localhost"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6