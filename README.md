# ArtGobblers Subgraph

Subgraph Endpoint
Synced at: <https://thegraph.com/hosted-service/subgraph/0x-stan/artgobblers>

Pending Changes at same URL

Currently tracking mock ArtGobblers on goerli testnet. once the artgobblers mainnet goes live we will switch to the real contract address.

Mock Artgobblers is used for testing VoltronGobblers, for more details see [voltron-gobblers](https://github.com/0x-stan/voltron-gobblers).

example query:

```graphql
query Example {
  artGobblersDatas {
    id
    gobblersAddress
    gooAddress
    mintListSupply
    numMintedFromGoo
    currentNonLegendaryId
    numMintedForReserves
    numMintedForCommunity
    legendaryAuctionInterval
  }
  legendaryGobblerAuctionDatas {
    id
    startPrice
    numSold
    legendaryGobblerIds {
      id
      emissionMultiple
      owner
      mintTimestamp
      price
    }
  }
  gobblerRevealsDatas {
    id
    randomSeed
    nextRevealTimestamp
    lastRevealedId
    toBeRevealed
    waitingForSeed
  }
  userDatas(first: 5, orderBy: gobblersOwned, orderDirection: desc) {
    id
    lastBalance
    lastBalanceDecimal
    lastTimestamp
    hasClaimedMintlistGobbler
    gobblersOwned
  }
  gobblerDatas(first: 5) {
    id
    emissionMultiple
    owner
    price
    priceDecimal
    mintTimestamp
    isClaimed
    isLegendary
  }
  artGobblersDataDailySnapshots(first: 5, orderDirection: desc) {
    id
    blockNumber
    numNonLegendary
    dailyNumNonLegendary
    numHolder
    dailyNewHolder
    emissionMultiple
    dailyEmissionMultiple
    dailyVolumeDecimal
    dailyAvgPriceDecimal
  }
  voltronUserDatas(first: 5) {
    id
    gobblersOwned
    emissionMultiple
    virtualBalanceDecimal
    claimedNum
    lastTimestamp
    gobblers {
      id
    }
  }
}
```
