AUCTION OF TOKENIZED CARBON CREDITS v1
----------------------------------------------------
3 types of users:   
    - OWNER (EOA that created AUCTION FACTORY smart contract can be transferred to the DAO in later phases)
    - SELLER (Account that has created AUCTION IMPLEMENTATION and is selling his/hers carbon certificate)
    - BIDDERS (Accounts that can bid on carbon certificate NFT)


Smart Contract driven british auction allows users to create   their own Auction implementation with defined parameters and become seller of his/hers carbon credit NFT. 

When user creates new auction implementation he has to pay creationFee for auction creation which is 0.03 ETH // 50$ at time of writing. This fee is transferred to the ownerFeePool and the owner can call function ownerFeeWithdraw with params to what address and how much of accumulated fees wants to withdraw.

While creating new auction implementation user also must provide parameters such as:
                    - address of the Carbon Credits NFT contract
                    - tokenId of NFT he possess 
                    - starting price of the NFT
                    - provide his account address to be initialize as seller
                    - provide the address of the token he wants to be paid in for the auction (ex. DAI, USDC stablecoins)

This will create new auction implementation which address can be found in deployedAuctions array under the corresponding index.

English Auction Implementation can be in one of following states during it's lifecycle: 

1. NOT STARTED (Seller has not started auction, _timeInverval in seconds is not provided, Bids are unavailable)
2. STARTED (Seller starts the auction, set time when auction expires, Users can bid on the NFT)
3. EXPIRED (Before seller calls the end() function, Bids are unavailable)
4. ENDED (Seller calls end() function, The transfers of NFT to the highestBidder and chosen token amount as highestBid to the seller are settled)

Bidder can bid again if his bid is not currently the highestBid by withdrawing the previous amount of tokens and bid with new amount.
