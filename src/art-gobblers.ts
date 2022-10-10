import { Address, BigInt, log } from "@graphprotocol/graph-ts";
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
import { ZERO_ADDRESS, INT_ONE } from "./constants";
import { loadGobblerData, loadUserData } from "./utils/loadOrNewEntity";
import { gobblersAddress } from "../deployment";

const gobblersContract = ArtGobblers.bind(Address.fromString(gobblersAddress));

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleArtGobbled(event: ArtGobbled): void {}

export function handleGobblerClaimed(event: GobblerClaimed): void {}

export function handleGobblerPurchased(event: GobblerPurchased): void {
  let user = loadUserData(event.params.user);
  user.gobblersOwned = user.gobblersOwned.plus(INT_ONE);
  user.save();

  let gobblerId = event.params.gobblerId;
  let gobbler = loadGobblerData(gobblerId);
  gobbler.owner = user.address;
  gobbler.save();
}

export function handleGobblersRevealed(event: GobblersRevealed): void {
  let num = event.params.numGobblers;
  let lastId = event.params.lastRevealedId;
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
      let userGobblers = user.gobblers;
      userGobblers.push(gobbler.id);
      user.gobblers = userGobblers;
      user.save();
    }
  }
}

export function handleGooBalanceUpdated(event: GooBalanceUpdated): void {
  let user = loadUserData(event.params.user);
  user.lastBalance = event.params.newGooBalance;
  user.lastTimestamp = event.block.timestamp;
  user.save();
}

export function handleLegendaryGobblerMinted(
  event: LegendaryGobblerMinted
): void {}

export function handleOwnerUpdated(event: OwnerUpdated): void {}

export function handleRandProviderUpgraded(event: RandProviderUpgraded): void {}

export function handleRandomnessFulfilled(event: RandomnessFulfilled): void {}

export function handleRandomnessRequested(event: RandomnessRequested): void {}

export function handleReservedGobblersMinted(
  event: ReservedGobblersMinted
): void {}

export function handleTransfer(event: Transfer): void {
  // from = AddressZero means mint
  // to = AddressZero means burn
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return

  const _id = event.params.id;
  let gobbler = loadGobblerData(_id);
  gobbler.owner = event.params.to;
  gobbler.save();

  let userFrom = loadUserData(event.params.from);
  // remove gobbler of from user
  userFrom.gobblersOwned = userFrom.gobblersOwned.minus(INT_ONE);
  let userFromGobblers = userFrom.gobblers;
  const _idString = _id.toString();
  // userFromGobblers = userFromGobblers.filter((i) => i !== _idString);
  let i = 0;
  let i2 = 0;
  for (i = 0; i < userFromGobblers.length; i++) {
    if (userFromGobblers[i] == _idString) {
      for (i2 = i; i2 < userFromGobblers.length - 1; i2++) {
        userFromGobblers[i2] = userFromGobblers[i2 + 1];
      }
      userFromGobblers.length = userFromGobblers.length - 1;
      break;
    }
  }
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
    userTo.lastTimestamp = event.block.timestamp;
  }
  userTo.save();
}
