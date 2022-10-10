import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import {
  ArtGobblers,
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
  Transfer,
} from "../generated/ArtGobblers/ArtGobblers";
import { ZERO_ADDRESS, INT_ONE, INT_DECIMAL, INT_ONE_DAYS } from "./constants";
import {
  loadArtGobblersData,
  loadGobblerData,
  loadGobblerRevealsData,
  loadUserData,
} from "./utils/loadOrNewEntity";
import { gobblersAddress } from "../deployment";
import { removeElementFromArray } from "./utils/utils";

const gobblersContract = ArtGobblers.bind(Address.fromString(gobblersAddress));

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleArtGobbled(event: ArtGobbled): void {}

export function handleGobblerClaimed(event: GobblerClaimed): void {
  let artGobblersData = loadArtGobblersData();
  artGobblersData.numMintedFromGoo = gobblersContract.try_numMintedFromGoo().value;
  artGobblersData.currentNonLegendaryId = gobblersContract.try_currentNonLegendaryId().value;
  // artGobblersData.numMintedForReserves = gobblersContract.try_numMintedForReserves().value;
  artGobblersData.save();

  let user = loadUserData(event.params.user);
  let gobblerId = event.params.gobblerId;
  let gobbler = loadGobblerData(gobblerId);

  user.gobblersOwned = user.gobblersOwned.plus(INT_ONE);
  let userGobblers = user.gobblers;
  userGobblers.push(gobbler.id);
  user.gobblers = userGobblers;
  user.hasClaimedMintlistGobbler = true;
  user.save();

  gobbler.owner = user.address;
  gobbler.save();
}

export function handleGobblerPurchased(event: GobblerPurchased): void {
  let artGobblersData = loadArtGobblersData();
  artGobblersData.numMintedFromGoo = gobblersContract.try_numMintedFromGoo().value;
  artGobblersData.currentNonLegendaryId = gobblersContract.try_currentNonLegendaryId().value;
  // artGobblersData.numMintedForReserves = gobblersContract.try_numMintedForReserves().value;
  artGobblersData.save();

  let user = loadUserData(event.params.user);
  let gobblerId = event.params.gobblerId;
  let gobbler = loadGobblerData(gobblerId);

  user.gobblersOwned = user.gobblersOwned.plus(INT_ONE);
  let userGobblers = user.gobblers;
  userGobblers.push(gobbler.id);
  user.gobblers = userGobblers;
  user.save();

  gobbler.owner = user.address;
  gobbler.save();
}

export function handleGobblersRevealed(event: GobblersRevealed): void {
  let num = event.params.numGobblers;
  let lastId = event.params.lastRevealedId;

  let revealsData = loadGobblerRevealsData();
  const callResult = gobblersContract.try_gobblerRevealsData();
  if (!callResult.reverted) {
    revealsData.randomSeed = callResult.value.getRandomSeed();
    revealsData.nextRevealTimestamp = callResult.value.getNextRevealTimestamp();
    revealsData.toBeRevealed = callResult.value.getToBeRevealed();
  }
  revealsData.lastRevealedId = lastId;
  revealsData.save();

  for (let i = 0; i < num.toI32(); i++) {
    const _id = lastId.minus(BigInt.fromI32(i));
    const callResult = gobblersContract.try_getGobblerData(_id);
    if (callResult.reverted) {
      log.info("getGobblerData reverted", [_id.toString()]);
    } else {
      const owner = callResult.value.getOwner();
      const idx = callResult.value.getIdx();
      const emissionMultiple = callResult.value.getEmissionMultiple();

      let gobbler = loadGobblerData(_id);
      gobbler.idx = idx;
      gobbler.emissionMultiple = emissionMultiple;
      gobbler.save();

      let user = loadUserData(owner);
      user.emissionMultiple = user.emissionMultiple.plus(emissionMultiple);
      user.save();
    }
  }
}

export function handleGooBalanceUpdated(event: GooBalanceUpdated): void {
  let user = loadUserData(event.params.user);
  user.lastBalance = event.params.newGooBalance;
  user.lastBalanceDecimal = event.params.newGooBalance
    .toBigDecimal()
    .div(INT_DECIMAL)
    .toString();
  user.lastTimestamp = event.block.timestamp;
  user.save();
}

export function handleLegendaryGobblerMinted(
  event: LegendaryGobblerMinted
): void {}

export function handleOwnerUpdated(event: OwnerUpdated): void {
  let artGobblersData = loadArtGobblersData();
  artGobblersData.owner = event.params.newOwner;
  artGobblersData.save();
}

export function handleRandProviderUpgraded(event: RandProviderUpgraded): void {
  let artGobblersData = loadArtGobblersData();
  artGobblersData.randProviderAddress = event.params.newRandProvider;
  artGobblersData.save();
}

export function handleRandomnessFulfilled(event: RandomnessFulfilled): void {
  let revealsData = loadGobblerRevealsData();
  revealsData.randomSeed = event.params.randomness;
  revealsData.waitingForSeed = false;
  revealsData.save();
}

export function handleRandomnessRequested(event: RandomnessRequested): void {
  let revealsData = loadGobblerRevealsData();
  revealsData.toBeRevealed = event.params.toBeRevealed;
  revealsData.nextRevealTimestamp = revealsData.nextRevealTimestamp.plus(
    INT_ONE_DAYS
  );
  revealsData.waitingForSeed = true;
  revealsData.save();
}

export function handleReservedGobblersMinted(
  event: ReservedGobblersMinted
): void {
  let artGobblersData = loadArtGobblersData();
  artGobblersData.currentNonLegendaryId = event.params.lastMintedGobblerId;
  artGobblersData.numMintedForReserves = artGobblersData.numMintedForReserves.plus(event.params.numGobblersEach);
  artGobblersData.numMintedForCommunity = artGobblersData.numMintedForCommunity.plus(event.params.numGobblersEach);
  artGobblersData.save();
}

export function handleTransfer(event: Transfer): void {
  // from = AddressZero means mint
  // to = AddressZero means burn
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS)
    return;

  const _id = event.params.id;
  let gobbler = loadGobblerData(_id);
  gobbler.owner = event.params.to;
  gobbler.save();

  let userFrom = loadUserData(event.params.from);
  // remove gobbler of from user
  userFrom.gobblersOwned = userFrom.gobblersOwned.minus(INT_ONE);
  let userFromGobblers = userFrom.gobblers;
  userFromGobblers = removeElementFromArray(_id.toString(), userFromGobblers);
  userFrom.gobblers = userFromGobblers;
  // update user's emissionMultiple
  let userFromDataRes = gobblersContract.try_getUserData(
    Address.fromBytes(userFrom.address)
  );
  if (!userFromDataRes.reverted) {
    userFrom.emissionMultiple = userFromDataRes.value.getEmissionMultiple();
  }
  // update goo balance
  let userFromGooBalanceRes = gobblersContract.try_gooBalance(
    Address.fromBytes(userFrom.address)
  );
  if (!userFromGooBalanceRes.reverted) {
    userFrom.lastBalance = userFromGooBalanceRes.value;
    userFrom.lastBalanceDecimal = userFromGooBalanceRes.value
      .toBigDecimal()
      .div(INT_DECIMAL)
      .toString();
    userFrom.lastTimestamp = event.block.timestamp;
  }
  userFrom.save();

  let userTo = loadUserData(event.params.to);
  // add gobbler of to user
  userTo.gobblersOwned = userTo.gobblersOwned.plus(INT_ONE);
  let userToGobblers = userTo.gobblers;
  userToGobblers.push(gobbler.id);
  userTo.gobblers = userToGobblers;
  // update user's emissionMultiple
  let userToDataRes = gobblersContract.try_getUserData(
    Address.fromBytes(userTo.address)
  );
  if (!userToDataRes.reverted) {
    userTo.emissionMultiple = userToDataRes.value.getEmissionMultiple();
  }
  // update goo balance
  let userToGooBalanceRes = gobblersContract.try_gooBalance(
    Address.fromBytes(userTo.address)
  );
  if (!userToGooBalanceRes.reverted) {
    userTo.lastBalance = userToGooBalanceRes.value;
    userTo.lastBalanceDecimal = userToGooBalanceRes.value
      .toBigDecimal()
      .div(INT_DECIMAL)
      .toString();
    userTo.lastTimestamp = event.block.timestamp;
  }
  userTo.save();
}
