const PORT = process.env.PORT || 8123
const YTMD_IP = process.env.YTMD_IP || '192.168.219.127:8303'
const { createServer } = require('http')
const path = require('path').resolve()
const fetch = require('node-fetch')
const express = require('express')
const morgan = require('morgan')
const app = express()
const srv = createServer(app)

app.use(morgan('common'))
app.get('/', (req, res) => res.sendFile(path + '/page/index.html'))

app.get('/api', (req, res) => {
  music_data().then((data) => {
    res.json(data)
  })
})

function music_data() {
  return new Promise((resolve) => {
    fetch(`http://${YTMD_IP}/query`, {method:'GET'}).then(res => res.json()).then(query => {
      fetch(`http://${YTMD_IP}/query/queue`, {method:'GET'}).then(res => res.json()).then(queue => {
        return resolve({ query, queue })
      })
    }).catch((err) => {
      return resolve({ status:500, msg:'Service Offline' })
    })
  })
}

srv.listen(PORT, () => console.log('http://localhost:' + PORT))
