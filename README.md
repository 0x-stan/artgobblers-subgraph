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
  userDatas(first: 5) {
    id
    lastBalance
    lastBalanceDecimal
    lastTimestamp
    hasClaimedMintlistGobbler
    gobblersOwned
    gobblers {
      id
    }
  }
  gobblerDatas(first: 20) {
    id
    emissionMultiple
    owner
  }
}
```
