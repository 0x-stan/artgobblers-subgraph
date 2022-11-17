# ArtGobblers Subgraph

Subgraph Endpoint
Synced at: <https://thegraph.com/hosted-service/subgraph/0x-stan/artgobblers>

Pending Changes at same URL

for more details see:

- [art-gobblers](https://github.com/artgobblers/art-gobblers)
- [voltron-gobblers](https://github.com/0x-stan/voltron-gobblers)

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
