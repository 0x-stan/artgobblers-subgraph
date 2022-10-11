# ArtGobblers Subgraph

Subgraph Endpoint
Synced at: <https://thegraph.com/hosted-service/subgraph/0x-stan/artgobblers>

Pending Changes at same URL

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
  userDatas(first: 5) {
    id
    lastBalance
    lastBalanceDecimal
    lastTimestamp
    hasClaimedMintlistGobbler
    gobblersOwned
  }
  gobblerDatas(first: 20) {
    id
    emissionMultiple
    owner
    price
    priceDecimal
    mintTimestamp
    isClaimed
    isLegendary
  }
}
```
