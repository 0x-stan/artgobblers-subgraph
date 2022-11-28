import { BigInt, ethereum, log, store } from "@graphprotocol/graph-ts";
import { GobblerData } from "../generated/schema";
import {
  VoltronGobblers,
  GooClaimed,
  GobblerDeposited,
  GobblerMinted,
  GobblerWithdrawn,
  GobblersClaimed,
  GooBalanceUpdated,
  OwnershipTransferred
} from "../generated/VoltronGobblers/VoltronGobblers";
import { BIGDECIMAL_DECIMAL } from "./constants";
import { loadGobblerData, loadVoltronGobblersData, loadVoltronUserData } from "./utils/loadOrCreateEntity";
import { removeElementFromArray } from "./utils/utils";

export function handleGooClaimed(event: GooClaimed): void {
  const user = event.params.to;
  const amount = event.params.amount;
  let voltronUserData = loadVoltronUserData(user);
  voltronUserData.virtualBalanceDecimal = voltronUserData.virtualBalanceDecimal.minus(amount.toBigDecimal());
  voltronUserData.save();
}

export function handleGobblerDeposited(event: GobblerDeposited): void {
  const user = event.params.user;
  const gobblerIds = event.params.gobblerIds;
  let sumEmissionMultiple = BigInt.fromI32(0);

  if (gobblerIds) {
    let voltronUserData = loadVoltronUserData(user);
    const len = BigInt.fromI32(gobblerIds.length);
    voltronUserData.gobblersOwned = voltronUserData.gobblersOwned.plus(len);
    let gobblers = voltronUserData.gobblers;
    for (let i = 0; i < gobblerIds.length; i++) {
      const _id = gobblerIds[i];
      let _gobblerData = loadGobblerData(_id);
      gobblers.push(_gobblerData.id);
      sumEmissionMultiple = sumEmissionMultiple.plus(_gobblerData.emissionMultiple);
    }
    voltronUserData.gobblers = gobblers;
    voltronUserData.emissionMultiple = voltronUserData.emissionMultiple.plus(sumEmissionMultiple);
    voltronUserData.save();

    let voltronGobblersData = loadVoltronGobblersData();
    voltronGobblersData.totalGobblersOwned = voltronGobblersData.totalGobblersOwned.plus(len);
    voltronGobblersData.totalEmissionMultiple = voltronGobblersData.totalEmissionMultiple.plus(sumEmissionMultiple);
    voltronGobblersData.save();
  }
}

export function handleGobblerMinted(event: GobblerMinted): void {
  const num = event.params.num;
  const gobblerIds = event.params.gobblerIds;

  let voltronGobblersData = loadVoltronGobblersData();
  voltronGobblersData.totalGobblersOwned = voltronGobblersData.totalGobblersOwned.plus(num);
  let claimableGobblers = voltronGobblersData.claimableGobblers;
  for (let i = 0; i < gobblerIds.length; i++) {
    const _id = gobblerIds[i];
    claimableGobblers.push(_id.toString());
  }
  voltronGobblersData.claimableGobblers = claimableGobblers;
  voltronGobblersData.save();
}

export function handleGobblerWithdrawn(event: GobblerWithdrawn): void {
  const user = event.params.user;
  const gobblerIds = event.params.gobblerIds;
  let voltronUserData = loadVoltronUserData(user);
  let sumEmissionMultiple = BigInt.fromI32(0);

  const len = BigInt.fromI32(gobblerIds.length);
  voltronUserData.gobblersOwned = voltronUserData.gobblersOwned.minus(len);
  let gobblers = voltronUserData.gobblers;
  for (let i = 0; i < gobblerIds.length; i++) {
    const _id = gobblerIds[i];
    let _gobblerData = loadGobblerData(_id);
    gobblers = removeElementFromArray(_gobblerData.id, gobblers);
    sumEmissionMultiple = sumEmissionMultiple.plus(_gobblerData.emissionMultiple);
  }
  voltronUserData.gobblers = gobblers;
  voltronUserData.emissionMultiple = voltronUserData.emissionMultiple.minus(sumEmissionMultiple);
  voltronUserData.save();

  let voltronGobblersData = loadVoltronGobblersData();
  voltronGobblersData.totalGobblersOwned = voltronGobblersData.totalGobblersOwned.minus(len);
  voltronGobblersData.totalEmissionMultiple = voltronGobblersData.totalEmissionMultiple.minus(sumEmissionMultiple);
  voltronGobblersData.save();
}

export function handleGobblersClaimed(event: GobblersClaimed): void {
  const user = event.params.user;
  const gobblerIds = event.params.gobblerIds;
  let sumEmissionMultiple = BigInt.fromI32(0);

  if (gobblerIds) {
    let voltronUserData = loadVoltronUserData(user);
    const len = BigInt.fromI32(gobblerIds.length);
    voltronUserData.gobblersOwned = voltronUserData.gobblersOwned.minus(len);
    let gobblers = voltronUserData.gobblers;
    for (let i = 0; i < gobblerIds.length; i++) {
      const _id = gobblerIds[i];
      let _gobblerData = loadGobblerData(_id);
      gobblers = removeElementFromArray(_gobblerData.id, gobblers);
      sumEmissionMultiple = sumEmissionMultiple.minus(_gobblerData.emissionMultiple);
    }
    voltronUserData.gobblers = gobblers;
    voltronUserData.emissionMultiple = voltronUserData.emissionMultiple.minus(sumEmissionMultiple);
    voltronUserData.save();

    let voltronGobblersData = loadVoltronGobblersData();
    voltronGobblersData.totalGobblersOwned = voltronGobblersData.totalGobblersOwned.minus(len);
    voltronGobblersData.totalEmissionMultiple = voltronGobblersData.totalEmissionMultiple.minus(sumEmissionMultiple);
    let globalGobblers = voltronGobblersData.claimableGobblers;
    for (let i = 0; i < gobblerIds.length; i++) {
      const _id = gobblerIds[i];
      let _gobblerData = loadGobblerData(_id);
      globalGobblers = removeElementFromArray(_gobblerData.id, globalGobblers);
      sumEmissionMultiple = sumEmissionMultiple.minus(_gobblerData.emissionMultiple);
    }
    voltronGobblersData.claimableGobblers = globalGobblers;
    voltronGobblersData.save();
  }
}

export function handleGooBalanceUpdated(event: GooBalanceUpdated): void {
  const user = event.params.user;
  const newGooBalance = event.params.newGooBalance;

  let voltronUserData = loadVoltronUserData(user);
  voltronUserData.virtualBalanceDecimal = newGooBalance.toBigDecimal().div(BIGDECIMAL_DECIMAL);
  voltronUserData.lastTimestamp = event.block.timestamp;
  voltronUserData.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
