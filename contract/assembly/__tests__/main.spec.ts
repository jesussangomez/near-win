import { addRace, getRaces } from '..'
import { PostedRace, races } from '../model'

function createRace(result: string): PostedRace {
  return new PostedRace(result)
}

const result = '{ "result": "{\"result\":\"You won!\",\"winner\":{\"id\":\"2\",\"name\":\"Greenly\"},\"player\":{\"id\":\"2\",\"name\":\"Greenly\"}}" }'

const race = createRace(result)

describe('Greeting ', () => {
  afterEach(() => {
    while(races.length > 0) {
      races.pop()
    }
  })

  it('add race result', () => {
    addRace(result)
    expect(races.length).toBe(
      1,
      'should only contain one race'
    )
    expect(races[0]).toStrictEqual(
      race,
      'race should be same as result'
    )
  })

  it('retrieves races', () => {
    addRace(result)
    const raceArr = getRaces()
    expect(raceArr.length).toBe(
      1,
      'should be one race'
    )
    expect(raceArr).toIncludeEqual(
      race,
      'races should include:\n' + race.toJSON()
    )
  })

  it('only show the last 10 races', () => {
    addRace(result)
    const newRaces: PostedRace[] = []
    for (let i: i32 = 0; i < 10; i++) {
      newRaces.push(createRace(result))
      addRace(result)
    }
    const races = getRaces()
    log(races.slice(7, 10))
    expect(races).toStrictEqual(
      newRaces,
      'should be the last ten races'
    )
  })
})
