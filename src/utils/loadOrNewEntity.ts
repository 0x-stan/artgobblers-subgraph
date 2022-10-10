import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { GobblerData, UserData, LegendaryGobblerAuctionData, GobblerRevealsData } from "../../generated/schema"

export function loadGobblerData(id: BigInt): GobblerData {
    let entity = GobblerData.load(id.toString())
    if (entity == null) {
        entity = new GobblerData(id.toString())
        entity.idx = BigInt.fromString("0")
        entity.owner = Address.fromI32(0)
        entity.emissionMultiple = BigInt.fromString("0")
    }
    return entity
}


export function loadUserData(address: Bytes): UserData {
    let entity = UserData.load(address.toHexString())
    if (entity == null) {
        entity = new UserData(address.toHexString())
        entity.address = address
        entity.gobblersOwned = BigInt.fromString("0")
        entity.emissionMultiple = BigInt.fromString("0")
        entity.lastBalance = BigInt.fromString("0")
        entity.lastTimestamp = BigInt.fromString("0")
        entity.gobblers = []
    }
    return entity
}

