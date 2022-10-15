import { BigInt } from "@graphprotocol/graph-ts"
import {
  VoltronGobblers,
  ClaimVoltronGoo,
  GobblerDepsit,
  GobblerMinted,
  GobblerWithdraw,
  GobblersClaimed,
  GooBalanceUpdated,
  OwnerUpdated
} from "../generated/VoltronGobblers/VoltronGobblers"

export function handleClaimVoltronGoo(event: ClaimVoltronGoo): void {
  
}

export function handleGobblerDepsit(event: GobblerDepsit): void {}

export function handleGobblerMinted(event: GobblerMinted): void {}

export function handleGobblerWithdraw(event: GobblerWithdraw): void {}

export function handleGobblersClaimed(event: GobblersClaimed): void {}

export function handleGooBalanceUpdated(event: GooBalanceUpdated): void {}

export function handleOwnerUpdated(event: OwnerUpdated): void {}
