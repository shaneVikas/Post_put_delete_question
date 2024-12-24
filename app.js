const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbpath = path.join(__dirname, 'cricketTeam.db')
let db = null

const initialiseDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('serverstarted')
    })
  } catch (e) {
    console.log(`Database Error: ${e.message}`)
    process.exit(1)
  }
}
initialiseDBandServer()

const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

app.get('/players/', async (request, response) => {
  const Query = `
    SELECT 
      * 
    FROM 
    cricket_team
    ORDER BY 
    player_Id
    `
  const playersArray = await db.all(Query)
  response.send(
    playersArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
  )
})
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `SELECT * FROM cricket_team  WHERE player_id = ${playerId}`
  const playersArray = await db.get(query)
  response.send(
    playersArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
  )
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const query = `INSERT INTO cricket_team (player_name, jersey_number, role) VALUES ('${player_nmae}', '${jerseyNumber}','${role})'`

  const adRequest = await db.run(query)
  response.send('Player Added to Team')
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `UPDATE cricket_team SET player_name = ${playerName}, jersey_number = ${jerseyNumber}, role = ${role} WHERE player_id = ${playerId}`

  const updateplyer = await db.run(query)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `DELETE FROM cricket_team WHERE player_id = ${playerId}`
  const deletePlayer = await db.run(query)
  response.send('Player Removed')
})
module.exports = app
