import { BigInt, Bytes, Address, ethereum, BigDecimal } from "@graphprotocol/graph-ts";
import {
  ArtGobblersData,
  GobblerData,
  UserData,
  LegendaryGobblerAuctionData,
  GobblerRevealsData,
  ArtGobblersDataDailySnapshot
} from "../../generated/schema";
import { ArtGobblers } from "../../generated/ArtGobblers/ArtGobblers";
import { initAddressZero } from "./utils";
import { gobblersAddress } from "../deployment";
import { SECONDS_PER_DAY } from "../constants";
const gobblersContract = ArtGobblers.bind(Address.fromString(gobblersAddress));

const ARTGOBBLERS_DATA_ID = "ArtGobblers";
const ARTGOBBLER_REVEALS_DATA_ID = "ArtGobblerReveals";
const LEGENDARY_DATA_ID = "LegendaryGoblers";

export function loadArtGobblersData(): ArtGobblersData {
  let entity = ArtGobblersData.load(ARTGOBBLERS_DATA_ID);
  if (entity == null) {
    entity = new ArtGobblersData(ARTGOBBLERS_DATA_ID);
    entity.owner = initAddressZero();
    entity.gobblersAddress = Address.fromHexString(gobblersAddress);

    {
      let callResult = gobblersContract.try_goo();
      entity.gooAddress = callResult.reverted ? Address.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_pages();
      entity.pagesAddress = callResult.reverted ? Address.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_team();
      entity.teamAddress = callResult.reverted ? Address.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_community();
      entity.communityAddress = callResult.reverted ? Address.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_randProvider();
      entity.randProviderAddress = callResult.reverted ? Address.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_MAX_SUPPLY();
      entity.gobblersMaxSupply = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_MINTLIST_SUPPLY();
      entity.mintListSupply = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_LEGENDARY_SUPPLY();
      entity.legendarySupply = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_RESERVED_SUPPLY();
      entity.reservedSupply = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_MAX_MINTABLE();
      entity.maxMintable = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_UNREVEALED_URI();
      entity.unrevealedURI = callResult.reverted ? "" : callResult.value;
    }

    {
      let callResult = gobblersContract.try_BASE_URI();
      entity.baseURI = callResult.reverted ? "" : callResult.value;
    }

    {
      let callResult = gobblersContract.try_merkleRoot();
      entity.merkleRoot = callResult.reverted ? Bytes.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_mintStart();
      entity.mintStart = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_numMintedFromGoo();
      entity.numMintedFromGoo = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_currentNonLegendaryId();
      entity.currentNonLegendaryId = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_numMintedForReserves();
      entity.numMintedForReserves = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_numMintedForReserves();
      entity.numMintedForCommunity = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_LEGENDARY_GOBBLER_INITIAL_START_PRICE();
      entity.legendaryGobblerInitialStartPrice = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_FIRST_LEGENDARY_GOBBLER_ID();
      entity.firstLegendaryGobblerId = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }

    {
      let callResult = gobblersContract.try_LEGENDARY_AUCTION_INTERVAL();
      entity.legendaryAuctionInterval = callResult.reverted ? BigInt.fromI32(0) : callResult.value;
    }
  }
  return entity;
}

export function loadGobblerData(id: BigInt): GobblerData {
  let entity = GobblerData.load(id.toString());
  if (entity == null) {
    entity = new GobblerData(id.toString());
    entity.idx = BigInt.fromString("0");
    entity.owner = initAddressZero();
    entity.emissionMultiple = BigInt.fromString("0");
    entity.isLegendary = false;
    entity.isClaimed = false;
    entity.mintTimestamp = BigInt.fromI32(0);
    entity.price = BigInt.fromI32(0);
    entity.priceDecimal = BigDecimal.fromString("0");
    entity.burnedForLedendary = BigInt.fromI32(0);
  }
  return entity;
}

export function loadUserData(address: Bytes): UserData {
  let entity = UserData.load(address.toHexString());
  if (entity == null) {
    entity = new UserData(address.toHexString());
    entity.address = address;
    entity.gobblersOwned = BigInt.fromString("0");
    entity.emissionMultiple = BigInt.fromString("0");
    entity.lastBalance = BigInt.fromString("0");
    entity.lastBalanceDecimal = "0";
    entity.lastTimestamp = BigInt.fromString("0");
    entity.hasClaimedMintlistGobbler = false;
    entity.gobblers = [];
  }
  return entity;
}

export function loadGobblerRevealsData(): GobblerRevealsData {
  let entity = GobblerRevealsData.load(ARTGOBBLER_REVEALS_DATA_ID); // only one gobblers contract
  if (entity == null) {
    entity = new GobblerRevealsData(ARTGOBBLER_REVEALS_DATA_ID);
    const callResult = gobblersContract.try_gobblerRevealsData();
    if (callResult.reverted) {
      entity.randomSeed = BigInt.fromString("0");
      entity.nextRevealTimestamp = BigInt.fromString("0");
      entity.lastRevealedId = BigInt.fromString("0");
      entity.toBeRevealed = BigInt.fromString("0");
      entity.waitingForSeed = false;
    } else {
      entity.randomSeed = callResult.value.getRandomSeed();
      entity.nextRevealTimestamp = callResult.value.getNextRevealTimestamp();
      entity.lastRevealedId = callResult.value.getLastRevealedId();
      entity.toBeRevealed = callResult.value.getToBeRevealed();
      entity.waitingForSeed = callResult.value.getWaitingForSeed();
    }
  }
  return entity;
}

export function loadLegendaryGobblerAuctionData(): LegendaryGobblerAuctionData {
  let entity = LegendaryGobblerAuctionData.load(LEGENDARY_DATA_ID); // only one gobblers contract
  if (entity == null) {
    entity = new LegendaryGobblerAuctionData(LEGENDARY_DATA_ID);
    entity.startPrice = BigInt.fromI32(0);
    entity.numSold = BigInt.fromI32(0);
    entity.legendaryGobblerIds = [];
  }
  return entity;
}

export function loadArtGobblersDataDailySnapshot(event: ethereum.Event): ArtGobblersDataDailySnapshot {
  // Number of days since Unix epoch
  let dayID = event.block.timestamp.toI32() / SECONDS_PER_DAY;
  let id = dayID.toString();

  let entity = ArtGobblersDataDailySnapshot.load(id);
  if (entity == null) {
    entity = new ArtGobblersDataDailySnapshot(id);
    entity.blockNumber = event.block.number;

    entity.numNonLegendary = BigInt.fromI32(0);
    entity.numMintedFromGoo = BigInt.fromI32(0);
    entity.numMintedFromClaim = BigInt.fromI32(0);
    entity.numMintedForReserves = BigInt.fromI32(0);
    entity.numMintedForCommunity = BigInt.fromI32(0);

    entity.dailyNumNonLegendary = BigInt.fromI32(0);
    entity.dailyNumMintedFromGoo = BigInt.fromI32(0);
    entity.dailyNumMintedFromClaim = BigInt.fromI32(0);
    entity.dailyNumMintedForReserves = BigInt.fromI32(0);
    entity.dailyNumMintedForCommunity = BigInt.fromI32(0);

    entity.numHolder = BigInt.fromI32(0);
    entity.dailyNewHolder = BigInt.fromI32(0);

    entity.emissionMultiple = BigInt.fromI32(0);
    entity.dailyEmissionMultiple = BigInt.fromI32(0);

    entity.dailyVolumeDecimal = BigDecimal.fromString("0");
    entity.dailyAvgPriceDecimal = BigDecimal.fromString("0");
  }

  return entity;
}
