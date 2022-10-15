import { BigInt } from "@graphprotocol/graph-ts";
import { GobblerData } from "../generated/schema";
import {
  VoltronGobblers,
  ClaimVoltronGoo,
  GobblerDepsit,
  GobblerMinted,
  GobblerWithdraw,
  GobblersClaimed,
  GooBalanceUpdated,
  OwnerUpdated
} from "../generated/VoltronGobblers/VoltronGobblers";

import { loadGobblerData, loadVoltronUserData } from "./utils/loadOrCreateEntity";

export function handleClaimVoltronGoo(event: ClaimVoltronGoo): void {}

export function handleGobblerDepsit(event: GobblerDepsit): void {
  const gobblerIds = event.params.gobblerIds;
  let voltronUserData = loadVoltronUserData(event.params.user);
  voltronUserData.gobblersOwned = voltronUserData.gobblersOwned.plus(BigInt.fromI32(gobblerIds.length));
  let gobblers = voltronUserData.gobblers;
  for (let i = 0; i < gobblerIds.length; i++) {
    const _id = gobblerIds[i];
    let _gobblerData = loadGobblerData(BigInt.fromI32(_id));
    gobblers.push(_gobblerData.id);
    voltronUserData.emissionMultiple = voltronUserData.emissionMultiple.plus(_gobblerData.emissionMultiple);
  }
  voltronUserData.gobblers = gobblers;
  voltronUserData.save();
}

export function handleGobblerMinted(event: GobblerMinted): void {}

export function handleGobblerWithdraw(event: GobblerWithdraw): void {}

export function handleGobblersClaimed(event: GobblersClaimed): void {}

export function handleGooBalanceUpdated(event: GooBalanceUpdated): void {}

export function handleOwnerUpdated(event: OwnerUpdated): void {}
