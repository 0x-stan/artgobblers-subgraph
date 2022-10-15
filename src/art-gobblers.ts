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
  Transfer
} from "../generated/ArtGobblers/ArtGobblers";
import { ZERO_ADDRESS, INT_ONE, INT_ONE_DAYS, BIGDECIMAL_DECIMAL, INT_DECIMAL, INT_ZERO } from "./constants";
import {
  loadArtGobblersData,
  loadGobblerData,
  loadGobblerRevealsData,
  loadUserData,
  loadLegendaryGobblerAuctionData,
  loadArtGobblersDataDailySnapshot
} from "./utils/loadOrCreateEntity";
import { gobblersAddress } from "./deployment";
import { removeElementFromArray } from "./utils/utils";

const gobblersContract = ArtGobblers.bind(Address.fromString(gobblersAddress));

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleArtGobbled(event: ArtGobbled): void {}

export function handleGobblerClaimed(event: GobblerClaimed): void {
  let artGobblersData = loadArtGobblersData();
  let callResult = gobblersContract.try_currentNonLegendaryId()
  if (!callResult.reverted) {
    artGobblersData.currentNonLegendaryId = callResult.value;
    artGobblersData.save();
  }

  let user = loadUserData(event.params.user);
  let gobblerId = event.params.gobblerId;
  let gobblerData = loadGobblerData(gobblerId);

  user.gobblersOwned = user.gobblersOwned.plus(INT_ONE);
  let userGobblers = user.gobblers;
  userGobblers.push(gobblerData.id);
  user.gobblers = userGobblers;
  user.hasClaimedMintlistGobbler = true;
  user.save();

  gobblerData.owner = user.address;
  gobblerData.isLegendary = false;
  gobblerData.isClaimed = true;
  gobblerData.mintTimestamp = event.block.timestamp;
  gobblerData.price = BigInt.fromI32(0);
  gobblerData.priceDecimal = BigDecimal.fromString("0");
  gobblerData.save();

  // update daily snapshot
  let dailySnapshot = loadArtGobblersDataDailySnapshot(event);
  dailySnapshot.numNonLegendary = artGobblersData.currentNonLegendaryId;
  dailySnapshot.numMintedFromClaim = dailySnapshot.numMintedFromClaim.plus(INT_ONE);

  dailySnapshot.dailyNumNonLegendary = dailySnapshot.dailyNumNonLegendary.plus(INT_ONE);
  dailySnapshot.dailyNumMintedFromClaim = dailySnapshot.dailyNumMintedFromClaim.plus(INT_ONE);

  if (user.gobblersOwned == INT_ONE) {
    dailySnapshot.numHolder = dailySnapshot.numHolder.plus(INT_ONE);
    dailySnapshot.dailyNewHolder = dailySnapshot.dailyNewHolder.plus(INT_ONE);
  }
  dailySnapshot.save();
}

export function handleGobblerPurchased(event: GobblerPurchased): void {
  let artGobblersData = loadArtGobblersData();
  let callResult = gobblersContract.try_numMintedFromGoo()
  if (!callResult.reverted) artGobblersData.numMintedFromGoo = callResult.value;
  callResult = gobblersContract.try_currentNonLegendaryId()
  if (!callResult.reverted) artGobblersData.currentNonLegendaryId = callResult.value;
  artGobblersData.save();

  let user = loadUserData(event.params.user);
  let gobblerId = event.params.gobblerId;
  let gobblerData = loadGobblerData(gobblerId);

  user.gobblersOwned = user.gobblersOwned.plus(INT_ONE);
  let userGobblers = user.gobblers;
  userGobblers.push(gobblerData.id);
  user.gobblers = userGobblers;
  user.save();

  gobblerData.owner = user.address;
  gobblerData.isLegendary = false;
  gobblerData.isClaimed = false;
  gobblerData.mintTimestamp = event.block.timestamp;
  gobblerData.price = event.params.price;
  gobblerData.priceDecimal = event.params.price.toBigDecimal().div(BIGDECIMAL_DECIMAL);
  gobblerData.save();

  // update daily snapshot
  let dailySnapshot = loadArtGobblersDataDailySnapshot(event);
  dailySnapshot.numMintedFromGoo = artGobblersData.numMintedFromGoo;
  dailySnapshot.numNonLegendary = artGobblersData.currentNonLegendaryId;

  dailySnapshot.dailyNumNonLegendary = dailySnapshot.dailyNumNonLegendary.plus(INT_ONE);
  dailySnapshot.dailyNumMintedFromGoo = dailySnapshot.dailyNumMintedFromGoo.plus(INT_ONE);

  if (user.gobblersOwned == INT_ONE) {
    dailySnapshot.numHolder = dailySnapshot.numHolder.plus(INT_ONE);
    dailySnapshot.dailyNewHolder = dailySnapshot.dailyNewHolder.plus(INT_ONE);
  }

  dailySnapshot.dailyVolumeDecimal = dailySnapshot.dailyVolumeDecimal.plus(gobblerData.priceDecimal);
  dailySnapshot.dailyAvgPriceDecimal = dailySnapshot.dailyVolumeDecimal.div(dailySnapshot.dailyNumMintedFromGoo.toBigDecimal());

  dailySnapshot.save();
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

  let sumEmissionMultiple = BigInt.fromI32(0);
  for (let i = 0; i < num.toI32(); i++) {
    const _id = lastId.minus(BigInt.fromI32(i));
    const callResult = gobblersContract.try_getGobblerData(_id);
    if (callResult.reverted) {
      log.info("getGobblerData reverted", [_id.toString()]);
    } else {
      const owner = callResult.value.getOwner();
      const idx = callResult.value.getIdx();
      const emissionMultiple = callResult.value.getEmissionMultiple();

      let gobblerData = loadGobblerData(_id);
      gobblerData.idx = idx;
      gobblerData.emissionMultiple = emissionMultiple;
      gobblerData.save();

      let user = loadUserData(owner);
      user.emissionMultiple = user.emissionMultiple.plus(emissionMultiple);
      user.save();

      sumEmissionMultiple = sumEmissionMultiple.plus(emissionMultiple);
    }
  }

  // update daily snapshot
  let dailySnapshot = loadArtGobblersDataDailySnapshot(event);
  dailySnapshot.emissionMultiple = dailySnapshot.emissionMultiple.plus(sumEmissionMultiple);
  dailySnapshot.dailyEmissionMultiple = dailySnapshot.dailyEmissionMultiple.plus(sumEmissionMultiple);
  dailySnapshot.save();
}

export function handleGooBalanceUpdated(event: GooBalanceUpdated): void {
  let user = loadUserData(event.params.user);
  user.lastBalance = event.params.newGooBalance;
  user.lastBalanceDecimal = event.params.newGooBalance
    .toBigDecimal()
    .div(BIGDECIMAL_DECIMAL);
  user.lastTimestamp = event.block.timestamp;
  user.save();
}

export function handleLegendaryGobblerMinted(event: LegendaryGobblerMinted): void {
  const legendaryGobblerId = event.params.gobblerId;
  const burndedList = event.params.burnedGobblerIds;

  let legendaryGobblerData = loadGobblerData(legendaryGobblerId);
  let gobblerDataRes = gobblersContract.try_getGobblerData(legendaryGobblerId);
  if (!gobblerDataRes.reverted) {
    legendaryGobblerData.owner = gobblerDataRes.value.getOwner();
    legendaryGobblerData.idx = gobblerDataRes.value.getIdx();
    legendaryGobblerData.emissionMultiple = gobblerDataRes.value.getEmissionMultiple();
    legendaryGobblerData.isLegendary = true;
    legendaryGobblerData.isClaimed = false;
    legendaryGobblerData.mintTimestamp = event.block.timestamp;
    legendaryGobblerData.price = BigInt.fromI32(burndedList.length);
    legendaryGobblerData.priceDecimal = legendaryGobblerData.price.toBigDecimal();
  }
  legendaryGobblerData.save();

  // legendary gobbler's m = sum(burned gobbler's m) * 2
  let sumEmissionMultiple = BigInt.fromI32(0);
  // burned gobblers map to legendary gobbler id
  for (let i = 0; i < burndedList.length; i++) {
    const _id = burndedList[i];
    let burnedGobblerData = loadGobblerData(_id);
    sumEmissionMultiple = sumEmissionMultiple.plus(burnedGobblerData.emissionMultiple);
    burnedGobblerData.burnedForLedendary = legendaryGobblerId;
    burnedGobblerData.save();
  }

  let auctionData = loadLegendaryGobblerAuctionData();
  const callResult = gobblersContract.try_legendaryGobblerAuctionData();
  if (!callResult.reverted) {
    auctionData.startPrice = callResult.value.getStartPrice();
    auctionData.numSold = callResult.value.getNumSold();
    let legendaryGobblerIds = auctionData.legendaryGobblerIds;
    legendaryGobblerIds.push(legendaryGobblerData.id);
    auctionData.legendaryGobblerIds = legendaryGobblerIds;
  }
  auctionData.save();

  let user = loadUserData(event.params.user);
  // remove burned gobblers
  let userGobblers = user.gobblers;
  for (let i = 0; i < burndedList.length; i++) {
    const _id = burndedList[i];
    userGobblers = removeElementFromArray(_id.toString(), userGobblers);
  }
  // add legendary gobbler id
  userGobblers.push(legendaryGobblerId.toString());
  user.gobblers = userGobblers;
  // update user data
  let userDataRes = gobblersContract.try_getUserData(Address.fromBytes(user.address));
  if (!userDataRes.reverted) {
    user.gobblersOwned = userDataRes.value.getGobblersOwned();
    user.emissionMultiple = userDataRes.value.getEmissionMultiple();
    user.lastBalance = userDataRes.value.getLastBalance();
    user.lastBalanceDecimal = user.lastBalance
      .toBigDecimal()
      .div(BIGDECIMAL_DECIMAL);
    user.lastTimestamp = userDataRes.value.getLastTimestamp();
  }

  user.save();

  // update daily snapshot
  let dailySnapshot = loadArtGobblersDataDailySnapshot(event);
  dailySnapshot.emissionMultiple = dailySnapshot.emissionMultiple.plus(sumEmissionMultiple);
  dailySnapshot.dailyEmissionMultiple = dailySnapshot.dailyEmissionMultiple.plus(sumEmissionMultiple);
  dailySnapshot.save();
}

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
  revealsData.nextRevealTimestamp = revealsData.nextRevealTimestamp.plus(INT_ONE_DAYS);
  revealsData.waitingForSeed = true;
  revealsData.save();
}

export function handleReservedGobblersMinted(event: ReservedGobblersMinted): void {
  let artGobblersData = loadArtGobblersData();
  artGobblersData.currentNonLegendaryId = event.params.lastMintedGobblerId;
  artGobblersData.numMintedForReserves = artGobblersData.numMintedForReserves.plus(event.params.numGobblersEach);
  artGobblersData.numMintedForCommunity = artGobblersData.numMintedForCommunity.plus(event.params.numGobblersEach);
  artGobblersData.save();

  // update daily snapshot
  let dailySnapshot = loadArtGobblersDataDailySnapshot(event);
  dailySnapshot.numMintedForReserves = dailySnapshot.numMintedForReserves.plus(event.params.numGobblersEach);
  dailySnapshot.numMintedForCommunity = dailySnapshot.numMintedForCommunity.plus(event.params.numGobblersEach);
  dailySnapshot.dailyNumMintedForReserves = dailySnapshot.dailyNumMintedForReserves.plus(event.params.numGobblersEach);
  dailySnapshot.dailyNumMintedForCommunity = dailySnapshot.dailyNumMintedForCommunity.plus(event.params.numGobblersEach);
  dailySnapshot.save();
}

export function handleTransfer(event: Transfer): void {
  // from = AddressZero means mint
  // to = AddressZero means burn
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return;

  const _id = event.params.id;
  let gobblerData = loadGobblerData(_id);
  gobblerData.owner = event.params.to;
  gobblerData.save();

  let userFrom = loadUserData(event.params.from);
  // remove gobbler of from user
  userFrom.gobblersOwned = userFrom.gobblersOwned.minus(INT_ONE);
  let userFromGobblers = userFrom.gobblers;
  userFromGobblers = removeElementFromArray(_id.toString(), userFromGobblers);
  userFrom.gobblers = userFromGobblers;
  // update user's emissionMultiple
  let userFromDataRes = gobblersContract.try_getUserData(Address.fromBytes(userFrom.address));
  if (!userFromDataRes.reverted) {
    userFrom.emissionMultiple = userFromDataRes.value.getEmissionMultiple();
  }
  // update goo balance
  let userFromGooBalanceRes = gobblersContract.try_gooBalance(Address.fromBytes(userFrom.address));
  if (!userFromGooBalanceRes.reverted) {
    userFrom.lastBalance = userFromGooBalanceRes.value;
    userFrom.lastBalanceDecimal = userFromGooBalanceRes.value
      .toBigDecimal()
      .div(BIGDECIMAL_DECIMAL);
    userFrom.lastTimestamp = event.block.timestamp;
  }
  userFrom.save();

  let userTo = loadUserData(event.params.to);
  // add gobbler of to user
  userTo.gobblersOwned = userTo.gobblersOwned.plus(INT_ONE);
  let userToGobblers = userTo.gobblers;
  userToGobblers.push(gobblerData.id);
  userTo.gobblers = userToGobblers;
  // update user's emissionMultiple
  let userToDataRes = gobblersContract.try_getUserData(Address.fromBytes(userTo.address));
  if (!userToDataRes.reverted) {
    userTo.emissionMultiple = userToDataRes.value.getEmissionMultiple();
  }
  // update goo balance
  let userToGooBalanceRes = gobblersContract.try_gooBalance(Address.fromBytes(userTo.address));
  if (!userToGooBalanceRes.reverted) {
    userTo.lastBalance = userToGooBalanceRes.value;
    userTo.lastBalanceDecimal = userToGooBalanceRes.value
      .toBigDecimal()
      .div(BIGDECIMAL_DECIMAL);
    userTo.lastTimestamp = event.block.timestamp;
  }
  userTo.save();

  // update daily snapshot
  let dailySnapshot = loadArtGobblersDataDailySnapshot(event);
  if (userFrom.gobblersOwned == INT_ZERO) {
    dailySnapshot.numHolder = dailySnapshot.numHolder.minus(INT_ONE);
    dailySnapshot.dailyNewHolder = dailySnapshot.dailyNewHolder.minus(INT_ONE);
  }
  if (userTo.gobblersOwned == INT_ONE) {
    dailySnapshot.numHolder = dailySnapshot.numHolder.plus(INT_ONE);
    dailySnapshot.dailyNewHolder = dailySnapshot.dailyNewHolder.plus(INT_ONE);
  }
  dailySnapshot.save();
}
