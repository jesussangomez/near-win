import { Context, logging, PersistentVector, storage } from 'near-sdk-as'
import { PostedRace, races } from './model'

const RACES_LIMIT = 10

export function addRace(result: string): void {
  const accountId = Context.sender
  const race = new PostedRace(result)
  logging.log(`Saving greeting "${result}" for account "${accountId}"`)
  races.push(race)
}

export function getRaces(): PostedRace[] {
  const numRaces = min(RACES_LIMIT, races.length)
  const startIndex = races.length - numRaces
  const result = new Array<PostedRace>(numRaces)

  for (let i = 0; i < numRaces; i++) {
    result[i] = races[i + startIndex]
  }

  return result
}
