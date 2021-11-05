import { Context, PersistentVector } from "near-sdk-as"

@nearBindgen
export class PostedRace {
  sender: string
  constructor(public race: string) {
    this.sender = Context.sender
  }
}

export const races = new PersistentVector<PostedRace>("races")
