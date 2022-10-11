import { BigInt, Bytes, Address, ethereum } from "@graphprotocol/graph-ts";
import {
  ArtGobblersData,
  GobblerData,
  UserData,
  LegendaryGobblerAuctionData,
  GobblerRevealsData,
} from "../../generated/schema";
import { ArtGobblers } from "../../generated/ArtGobblers/ArtGobblers";
import { initAddressZero } from "./utils";
import { gobblersAddress } from "../deployment";
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
      if (!callResult.reverted) entity.gooAddress = callResult.value;
    }

    {
      let callResult = gobblersContract.try_pages();
      if (!callResult.reverted) entity.pagesAddress = callResult.value;
    }

    {
      let callResult = gobblersContract.try_team();
      if (!callResult.reverted) entity.teamAddress = callResult.value;
    }

    {
      let callResult = gobblersContract.try_community();
      if (!callResult.reverted) entity.communityAddress = callResult.value;
    }

    {
      let callResult = gobblersContract.try_randProvider();
      if (!callResult.reverted) entity.randProviderAddress = callResult.value;
    }

    {
      let callResult = gobblersContract.try_MAX_SUPPLY();
      if (!callResult.reverted) entity.gobblersMaxSupply = callResult.value;
    }

    {
      let callResult = gobblersContract.try_MINTLIST_SUPPLY();
      if (!callResult.reverted) entity.mintListSupply = callResult.value;
    }

    {
      let callResult = gobblersContract.try_LEGENDARY_SUPPLY();
      if (!callResult.reverted) entity.legendarySupply = callResult.value;
    }

    {
      let callResult = gobblersContract.try_RESERVED_SUPPLY();
      if (!callResult.reverted) entity.reservedSupply = callResult.value;
    }

    {
      let callResult = gobblersContract.try_MAX_MINTABLE();
      if (!callResult.reverted) entity.maxMintable = callResult.value;
    }

    {
      let callResult = gobblersContract.try_UNREVEALED_URI();
      if (!callResult.reverted) entity.unrevealedURI = callResult.value;
    }

    {
      let callResult = gobblersContract.try_BASE_URI();
      if (!callResult.reverted) entity.baseURI = callResult.value;
    }

    {
      let callResult = gobblersContract.try_merkleRoot();
      if (!callResult.reverted) entity.merkleRoot = callResult.value;
    }

    {
      let callResult = gobblersContract.try_mintStart();
      if (!callResult.reverted) entity.mintStart = callResult.value;
    }

    {
      let callResult = gobblersContract.try_numMintedFromGoo();
      if (!callResult.reverted) entity.numMintedFromGoo = callResult.value;
    }

    {
      let callResult = gobblersContract.try_currentNonLegendaryId();
      if (!callResult.reverted) entity.currentNonLegendaryId = callResult.value;
    }

    {
      let callResult = gobblersContract.try_numMintedForReserves();
      if (!callResult.reverted) entity.numMintedForReserves = callResult.value;
    }

    {
      let callResult = gobblersContract.try_numMintedForReserves();
      if (!callResult.reverted) entity.numMintedForCommunity = callResult.value;
    }

    {
      let callResult = gobblersContract.try_LEGENDARY_GOBBLER_INITIAL_START_PRICE();
      if (!callResult.reverted)
        entity.legendaryGobblerInitialStartPrice = callResult.value;
    }

    {
      let callResult = gobblersContract.try_FIRST_LEGENDARY_GOBBLER_ID();
      if (!callResult.reverted)
        entity.firstLegendaryGobblerId = callResult.value;
    }

    {
      let callResult = gobblersContract.try_LEGENDARY_AUCTION_INTERVAL();
      if (!callResult.reverted)
        entity.legendaryAuctionInterval = callResult.value;
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
