import { Address, Bytes } from "@graphprotocol/graph-ts";

export function removeElementFromArray(
  element: string,
  arr: string[]
): string[] {
  let i = arr.indexOf(element)
  arr.splice(i, 1)

  return arr
}

export function initAddressZero(): Bytes {
  return Address.fromHexString("0x0000000000000000000000000000000000000000");
}
