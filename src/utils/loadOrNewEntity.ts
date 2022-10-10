import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import {
  ArtGobblersData,
  GobblerData,
  UserData,
  LegendaryGobblerAuctionData,
  GobblerRevealsData,
} from "../../generated/schema";
import { ZERO_ADDRESS } from "../constants";
import { ArtGobblers } from "../../generated/ArtGobblers/ArtGobblers";
import { gobblersAddress } from "../../deployment";
const gobblersContract = ArtGobblers.bind(Address.fromString(gobblersAddress));

const ARTGOBBLERS_DATA_ID = "ArtGobblers";
const ARTGOBBLER_REVEALS_DATA_ID = "ArtGobblerReveals";

export function loadArtGobblersData(): ArtGobblersData {
  let entity = ArtGobblersData.load(ARTGOBBLERS_DATA_ID);
  if (entity == null) {
    entity = new ArtGobblersData(ARTGOBBLERS_DATA_ID);
    entity.owner = ZERO_ADDRESS;
    entity.gobblersAddress = Address.fromHexString(gobblersAddress);
    entity.gooAddress = gobblersContract.try_goo().value;
    entity.pagesAddress = gobblersContract.try_pages().value;
    entity.teamAddress = gobblersContract.try_team().value;
    entity.communityAddress = gobblersContract.try_community().value;
    entity.randProviderAddress = gobblersContract.try_randProvider().value;
    entity.gobblersMaxSupply = gobblersContract.try_MAX_SUPPLY().value;
    entity.mintListSupply = gobblersContract.try_MINTLIST_SUPPLY().value;
    entity.legendarySupply = gobblersContract.try_LEGENDARY_SUPPLY().value;
    entity.reservedSupply = gobblersContract.try_RESERVED_SUPPLY().value;
    entity.maxMintable = gobblersContract.try_MAX_MINTABLE().value;
    entity.unrevealedURI = gobblersContract.try_UNREVEALED_URI().value;
    entity.baseURI = gobblersContract.try_BASE_URI().value;
    entity.merkleRoot = gobblersContract.try_merkleRoot().value;
    entity.mintStart = gobblersContract.try_mintStart().value;
    entity.numMintedFromGoo = gobblersContract.try_numMintedFromGoo().value;
    entity.currentNonLegendaryId = gobblersContract.try_currentNonLegendaryId().value;
    entity.numMintedForReserves = gobblersContract.try_numMintedForReserves().value;
    entity.legendaryGobblerInitialStartPrice = gobblersContract.try_LEGENDARY_GOBBLER_INITIAL_START_PRICE().value;
    entity.firstLegendaryGobblerId = gobblersContract.try_FIRST_LEGENDARY_GOBBLER_ID().value;
    entity.legendaryAuctionInterval = gobblersContract.try_LEGENDARY_AUCTION_INTERVAL().value;
  }
  return entity;
}

export function loadGobblerData(id: BigInt): GobblerData {
  let entity = GobblerData.load(id.toString());
  if (entity == null) {
    entity = new GobblerData(id.toString());
    entity.idx = BigInt.fromString("0");
    entity.owner = ZERO_ADDRESS;
    entity.emissionMultiple = BigInt.fromString("0");
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
