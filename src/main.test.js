beforeAll(async function () {
  // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
  const near = await nearlib.connect(nearConfig)
  window.accountId = nearConfig.contractName
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['getRaces'],
    changeMethods: ['addRace'],
    sender: window.accountId
  })

  window.walletConnection = {
    requestSignIn() {
    },
    signOut() {
    },
    isSignedIn() {
      return true
    },
    getAccountId() {
      return window.accountId
    }
  }
})

const result = '{ "result": "{\"result\":\"You won!\",\"winner\":{\"id\":\"2\",\"name\":\"Greenly\"},\"player\":{\"id\":\"2\",\"name\":\"Greenly\"}}" }'

test('send one race result and retrieve it', async () => {
  await window.contract.addRace({ result: result })
  const races = await window.contract.getRaces()
  const expectedRaceResult = [{
    sender: window.accountId,
    race: result
  }]

  expect(races).toEqual(expectedRaceResult)
})

test('send two more races and expect three total', async () => {
  await window.contract.addRace({ result: result })
  await window.contract.addRace({ result: result })
  const races = await window.contract.getRaces()
  expect(races.length).toEqual(3)
})
