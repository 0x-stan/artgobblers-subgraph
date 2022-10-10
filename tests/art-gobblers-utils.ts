import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  ArtGobbled,
  GobblerClaimed,
  GobblerPurchased,
  GobblersRevealed,
  GooBalanceUpdated,
  LegendaryGobblerMinted,
  OwnerUpdated,
  RandProviderUpgraded,
  RandomnessFulfilled,
  RandomnessRequested,
  ReservedGobblersMinted,
  Transfer
} from "../generated/ArtGobblers/ArtGobblers"

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  id: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createArtGobbledEvent(
  user: Address,
  gobblerId: BigInt,
  nft: Address,
  id: BigInt
): ArtGobbled {
  let artGobbledEvent = changetype<ArtGobbled>(newMockEvent())

  artGobbledEvent.parameters = new Array()

  artGobbledEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  artGobbledEvent.parameters.push(
    new ethereum.EventParam(
      "gobblerId",
      ethereum.Value.fromUnsignedBigInt(gobblerId)
    )
  )
  artGobbledEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  artGobbledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return artGobbledEvent
}

export function createGobblerClaimedEvent(
  user: Address,
  gobblerId: BigInt
): GobblerClaimed {
  let gobblerClaimedEvent = changetype<GobblerClaimed>(newMockEvent())

  gobblerClaimedEvent.parameters = new Array()

  gobblerClaimedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  gobblerClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "gobblerId",
      ethereum.Value.fromUnsignedBigInt(gobblerId)
    )
  )

  return gobblerClaimedEvent
}

export function createGobblerPurchasedEvent(
  user: Address,
  gobblerId: BigInt,
  price: BigInt
): GobblerPurchased {
  let gobblerPurchasedEvent = changetype<GobblerPurchased>(newMockEvent())

  gobblerPurchasedEvent.parameters = new Array()

  gobblerPurchasedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  gobblerPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "gobblerId",
      ethereum.Value.fromUnsignedBigInt(gobblerId)
    )
  )
  gobblerPurchasedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return gobblerPurchasedEvent
}

export function createGobblersRevealedEvent(
  user: Address,
  numGobblers: BigInt,
  lastRevealedId: BigInt
): GobblersRevealed {
  let gobblersRevealedEvent = changetype<GobblersRevealed>(newMockEvent())

  gobblersRevealedEvent.parameters = new Array()

  gobblersRevealedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  gobblersRevealedEvent.parameters.push(
    new ethereum.EventParam(
      "numGobblers",
      ethereum.Value.fromUnsignedBigInt(numGobblers)
    )
  )
  gobblersRevealedEvent.parameters.push(
    new ethereum.EventParam(
      "lastRevealedId",
      ethereum.Value.fromUnsignedBigInt(lastRevealedId)
    )
  )

  return gobblersRevealedEvent
}

export function createGooBalanceUpdatedEvent(
  user: Address,
  newGooBalance: BigInt
): GooBalanceUpdated {
  let gooBalanceUpdatedEvent = changetype<GooBalanceUpdated>(newMockEvent())

  gooBalanceUpdatedEvent.parameters = new Array()

  gooBalanceUpdatedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  gooBalanceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newGooBalance",
      ethereum.Value.fromUnsignedBigInt(newGooBalance)
    )
  )

  return gooBalanceUpdatedEvent
}

export function createLegendaryGobblerMintedEvent(
  user: Address,
  gobblerId: BigInt,
  burnedGobblerIds: Array<BigInt>
): LegendaryGobblerMinted {
  let legendaryGobblerMintedEvent = changetype<LegendaryGobblerMinted>(
    newMockEvent()
  )

  legendaryGobblerMintedEvent.parameters = new Array()

  legendaryGobblerMintedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  legendaryGobblerMintedEvent.parameters.push(
    new ethereum.EventParam(
      "gobblerId",
      ethereum.Value.fromUnsignedBigInt(gobblerId)
    )
  )
  legendaryGobblerMintedEvent.parameters.push(
    new ethereum.EventParam(
      "burnedGobblerIds",
      ethereum.Value.fromUnsignedBigIntArray(burnedGobblerIds)
    )
  )

  return legendaryGobblerMintedEvent
}

export function createOwnerUpdatedEvent(
  user: Address,
  newOwner: Address
): OwnerUpdated {
  let ownerUpdatedEvent = changetype<OwnerUpdated>(newMockEvent())

  ownerUpdatedEvent.parameters = new Array()

  ownerUpdatedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  ownerUpdatedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownerUpdatedEvent
}

export function createRandProviderUpgradedEvent(
  user: Address,
  newRandProvider: Address
): RandProviderUpgraded {
  let randProviderUpgradedEvent = changetype<RandProviderUpgraded>(
    newMockEvent()
  )

  randProviderUpgradedEvent.parameters = new Array()

  randProviderUpgradedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  randProviderUpgradedEvent.parameters.push(
    new ethereum.EventParam(
      "newRandProvider",
      ethereum.Value.fromAddress(newRandProvider)
    )
  )

  return randProviderUpgradedEvent
}

export function createRandomnessFulfilledEvent(
  randomness: BigInt
): RandomnessFulfilled {
  let randomnessFulfilledEvent = changetype<RandomnessFulfilled>(newMockEvent())

  randomnessFulfilledEvent.parameters = new Array()

  randomnessFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "randomness",
      ethereum.Value.fromUnsignedBigInt(randomness)
    )
  )

  return randomnessFulfilledEvent
}

export function createRandomnessRequestedEvent(
  user: Address,
  toBeRevealed: BigInt
): RandomnessRequested {
  let randomnessRequestedEvent = changetype<RandomnessRequested>(newMockEvent())

  randomnessRequestedEvent.parameters = new Array()

  randomnessRequestedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  randomnessRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "toBeRevealed",
      ethereum.Value.fromUnsignedBigInt(toBeRevealed)
    )
  )

  return randomnessRequestedEvent
}

export function createReservedGobblersMintedEvent(
  user: Address,
  lastMintedGobblerId: BigInt,
  numGobblersEach: BigInt
): ReservedGobblersMinted {
  let reservedGobblersMintedEvent = changetype<ReservedGobblersMinted>(
    newMockEvent()
  )

  reservedGobblersMintedEvent.parameters = new Array()

  reservedGobblersMintedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  reservedGobblersMintedEvent.parameters.push(
    new ethereum.EventParam(
      "lastMintedGobblerId",
      ethereum.Value.fromUnsignedBigInt(lastMintedGobblerId)
    )
  )
  reservedGobblersMintedEvent.parameters.push(
    new ethereum.EventParam(
      "numGobblersEach",
      ethereum.Value.fromUnsignedBigInt(numGobblersEach)
    )
  )

  return reservedGobblersMintedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  id: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return transferEvent
}
