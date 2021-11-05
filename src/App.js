import 'regenerator-runtime/runtime'
import React, { useEffect, useState } from 'react'
import { login, logout } from './utils'
import './index.css'

import {
  Balloon,
  Button,
  Container as NesContainer,
  Progress,
  Sprite
} from 'nes-react'

import { 
  Col,
  Container,
  Row 
} from 'react-grid-system'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {

  const initialPlayers = [
    {
      color: '',
      id: '0',
      name: 'Blacky',
      progress: 0
    },
    {
      color: '#006bb3',
      id: '1',
      name: 'Bluely',
      progress: 0
    },
    {
      color: '#4aa52e',
      id: '2',
      name: 'Greenly',
      progress: 0
    },
    {
      color: '#e59400',
      id: '3',
      name: 'Yellowly',
      progress: 0
    },
    {
      color: '#8c2022',
      id: '4',
      name: 'Redly',
      progress: 0
    },
  ]

  const [balloonText, setBalloonText] = useState('Are you ready to bet!?')
  const [playerChoseText, setPlayerChoseText] = React.useState('You haven\'t chosen a player yet')

  const [started, setStarted] = useState(false)

  const [players, setPlayers] = useState(initialPlayers)
  const [player, setPlayer] = React.useState(null)

  const [winner, setWinner] = React.useState(null)

  const [latestRaces, setLatestRaces] = useState([])

  const getLatestRaces = () => {
    window.contract.getRaces()
      .then(races => {
        setLatestRaces(races)
      })
  }

  useEffect(() => {
    if (window.walletConnection.isSignedIn()) {
      getLatestRaces()
    }
  }, [])

  if (!window.walletConnection.isSignedIn()) {
    return (
      <NesContainer style={{ margin: '4em' }} className="container">
        <h1>Welcome to NEAR Win!</h1>
        <p>
          This is a simple dice race game where you can make a bet.
        </p>
        <p>
          <b>NEAR Win</b> make use of the NEAR blockchain, you need to sign in. The button
          below will sign you in using NEAR Wallet.
        </p>
        <p>
          By default, when your app runs in "development" mode, it connects
          to a test network ("testnet") wallet. This works just like the main
          network ("mainnet") wallet, but the NEAR Tokens on testnet aren't
          convertible to other currencies – they're just for testing!
        </p>
        <p>
          Go ahead and click the button below to try it out:
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <Button onClick={login} primary>Sign in</Button>
        </p>
      </NesContainer>
    )
  }

  const sleep = (milli) => {
    return new Promise(resolve => setTimeout(resolve, milli))
  }

  const choosePlayer = (player) => {
    setPlayer(player)
  }

  useEffect(() => {
    if (player !== null) {
      setPlayerChoseText(`You chose ${players[player].name}`)
      setBalloonText(`You chose ${players[player].name}`)
    }
  }, [player])

  const addRace = async (result) => {
    try {
      // make an update call to the smart contract
      await window.contract.addRace({
        // pass the value that the user entered in the greeting field
        result: result
      })
    } catch (e) {
      // alert(
      //   'Something went wrong! ' +
      //   'Maybe you need to sign out and back in? ' +
      //   'Check your browser console for more info.'
      // )
      throw e
    } finally {
      // re-enable the form, whether the call succeeded or failed
      // fieldset.disabled = false
    }
  }

  useEffect(() => {
    if (winner !== null) {
      const result = winner.id === `${player}` ? 'You won!' : 'You lost!'
      setBalloonText(result)

      var race = {
        result: result,
        winner: {
          id: winner.id,
          name: winner.name
        },
        player: {
          id: players[player].id,
          name: players[player].name
        }
      }
      
      addRace(JSON.stringify(race))
    }
  }, [winner])

  const startRace = async () => {
    setStarted(true)
    var localWinner = null
    while(localWinner === null) {
      for (let i = 0; i < players.length; i++) {
        var dice = Math.floor(Math.random() * 10)
        var newPlayers = [...players]
        newPlayers[i]['progress'] += (dice * 1)
        setPlayers(newPlayers)
        await sleep(10)

        if (newPlayers[i]['progress'] >= 100) {
          localWinner = newPlayers[i]
          break
        }
      }
    }

    setWinner(localWinner)
  }

  const startOver = () => {
    setPlayers(initialPlayers)
    setPlayer(null)
    setWinner(null)
    setStarted(false)
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <Container className="container" fluid>
        <Row align="center" >
          <Col >
            <h3>Hi, {window.accountId}!</h3>
          </Col>
          <Col xs="content" >
            <Button error onClick={logout}>
              Sign out
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col lg={3} >
            <Row align="center" >
              <Col lg={12} >
                <div style={{ display: "flex" }}>
                  <Sprite sprite="octocat" style={{ alignSelf: "flex-end", marginRight: "1rem" }} />
                  <Balloon style={{ margin: "2rem", marginBottom: "4rem", maxWidth: "400px" }} fromLeft>
                    {balloonText}
                  </Balloon>
                </div>
              </Col>
              <Col style={{ paddingTop: '2rem' }} xs={12}>
                <NesContainer title="Choose your Player">
                  <Button disabled={player === 0 || started} onClick={() => choosePlayer(0)}>{players[0]['name']}</Button>
                  <Button disabled={player === 1 || started} onClick={() => choosePlayer(1)} primary>{players[1]['name']}</Button>
                  <Button disabled={player === 2 || started} onClick={() => choosePlayer(2)} success>{players[2]['name']}</Button>
                  <Button disabled={player === 3 || started} onClick={() => choosePlayer(3)} warning>{players[3]['name']}</Button>
                  <Button disabled={player === 4 || started} onClick={() => choosePlayer(4)} error>{players[4]['name']}</Button>
                </NesContainer>
                {/* <p style={{ marginBottom: '1em', marginTop: '3em' }}>{playerChoseText}</p>
                <Button disabled={player === null} onClick={() => startRace()} success>Start the Race!</Button> */}
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <Row align="center">
              <Col >
                {/* <p style={{ marginBottom: '0', }}>{playerChoseText}</p> */}
              </Col>
              <Col xs="content" >
                {
                  (!started) ? 
                    <Button disabled={player === null} onClick={startRace} success>Start the Race!</Button>
                   : 
                    <Button disabled={winner === null} onClick={startOver} error>Start Over</Button>
                }
              </Col>
            </Row>
            <br />
            <NesContainer title="Let's race!">
              <p style={{ marginBottom: '1em', marginTop: '1em' }}>Blacky</p>
              <Progress value={players[0].progress} max={100} />
              <p style={{ color: `${players[1].color}`, marginBottom: '1em', marginTop: '1em' }}>Bluely</p>
              <Progress value={players[1].progress} max={100} primary />
              <p style={{ color: `${players[2].color}`, marginBottom: '1em', marginTop: '1em' }}>Greenly</p>
              <Progress value={players[2].progress} max={100} success />
              <p style={{ color: `${players[3].color}`, marginBottom: '1em', marginTop: '1em' }}>Yellowly</p>
              <Progress value={players[3].progress} max={100} warning />
              <p style={{ color: `${players[4].color}`, marginBottom: '1em', marginTop: '1em' }}>Redly</p>
              <Progress value={players[4].progress} max={100} error />
              {/* <Progress value={40} max={100} pattern /> */}
            </NesContainer>
          </Col>
          <Col lg={3}>
            <Row align="center">
              <Col xs="content" >
                <Button onClick={getLatestRaces} primary>Update Latest Results</Button>
              </Col>
            </Row>
            <br />
            <NesContainer title="Latest Results">
              {
                latestRaces.length > 0 ?
                  latestRaces.slice(0).reverse().map(item => {
                    const race = JSON.parse(item.race)
                    const result = race.result === 'You lost!' ? 'lost' : 'won'
                    const player = race.player.name
                    const winner = race.winner.name
                    return (
                      <>
                        <p style={{ fontSize: '0.8em', marginBottom: '1.2em', marginTop: '1em' }}>
                          <b>{item.sender}</b> <span style={{ opacity: 0.5 }}>played with</span> <b>{player}</b> <span style={{ opacity: 0.5 }}>and</span> <b>{result}!</b>
                        </p>
                      </>
                    )
                  }) : <p style={{ marginBottom: '1em', marginTop: '1em' }}>No data found</p>
              }
            </NesContainer>
          </Col>
        </Row>
      </Container>
    </>
  )
}
