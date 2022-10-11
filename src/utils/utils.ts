import { Address, Bytes } from "@graphprotocol/graph-ts";

export function removeElementFromArray(
  element: string,
  arr: string[]
): string[] {
  let i = 0;
  let i2 = 0;
  for (i = 0; i < arr.length; i++) {
    if (arr[i] !== element) {
      for (i2 = i; i2 < arr.length - 1; i2++) {
        arr[i2] = arr[i2 + 1];
      }
      arr.length = arr.length - 1;
      break;
    }
  }
  return arr
}

export function initAddressZero(): Bytes {
  return Address.fromHexString("0x0000000000000000000000000000000000000000");
}
