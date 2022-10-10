import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = Address.fromHexString("0x0000000000000000000000000000000000000000");
export const INT_ZERO = BigInt.fromI32(0);
export const INT_ONE = BigInt.fromI32(1);
export const INT_DECIMAL = BigDecimal.fromString("1000000000000000000");
export const INT_ONE_DAYS = BigInt.fromI32(24*60*60);
