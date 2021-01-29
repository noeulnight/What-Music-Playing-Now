const PORT = process.env.PORT || 8080
const YTMD_IP = process.env.YTMD_IP || '192.168.219.127:8303'
const { createServer } = require('http')
const path = require('path').resolve()
const fetch = require('node-fetch')
const express = require('express')
const app = express()

const Socket = require('socket.io')
const SocketClient = require('socket.io-client')
const srv = createServer(app)
const wss = Socket(srv)
const ioClient = SocketClient.io('ws://localhost:9863')

app.get('/', (req, res) => res.sendFile(path + '/page/index.html'))

setInterval(() => {
  ioClient.emit('query-player', ('hi'))
}, 1000)
ioClient.on("player", (msg) => console.log(msg))

wss.on('connection', (socket) => {
  setInterval(() => {
    music_data().then((data) => {
      socket.emit('tick', data)
    })
  }, 500)
})

app.get('/api', (req, res) => {
  music_data().then((data) => {
    res.json(data)
  })
})

function music_data() {
  return new Promise((resolve) => {
    fetch(`http://${YTMD_IP}/query`, {method:'GET'}).then(res => res.json()).then(query => {
      fetch(`http://${YTMD_IP}/query/queue`, {method:'GET'}).then(res => res.json()).then(queue => {
        resolve({ query, queue })
      })
    })
  })
}

srv.listen(PORT, () => console.log('http://localhost:' + PORT))
