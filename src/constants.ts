import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = Address.fromHexString("0x0000000000000000000000000000000000000000");
export const INT_ZERO = BigInt.fromI32(0);
export const INT_ONE = BigInt.fromI32(1);
export const INT_DECIMAL = BigInt.fromString("1000000000000000000");
export const INT_ONE_DAYS = BigInt.fromI32(24*60*60);

export const BIGDECIMAL_DECIMAL = BigDecimal.fromString("1000000000000000000");

export const DAYS_PER_YEAR = new BigDecimal(BigInt.fromI32(365));
export const SECONDS_PER_DAY = 60 * 60 * 24;
export const SECONDS_PER_HOUR = 60 * 60;
export const MS_PER_DAY = new BigDecimal(BigInt.fromI32(24 * 60 * 60 * 1000));
export const MS_PER_YEAR = DAYS_PER_YEAR.times(new BigDecimal(BigInt.fromI32(24 * 60 * 60 * 1000)));
