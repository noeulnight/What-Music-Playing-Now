const PORT = process.env.PORT || 8123
const YTMD_IP = process.env.YTMD_IP || '192.168.219.127:8303'
const { createServer } = require('http')
const path = require('path').resolve()
const su = require('superagent')
const express = require('express')
const morgan = require('morgan')
const app = express()
const srv = createServer(app)

app.use(morgan('common'))
app.get('/', (req, res) => res.sendFile(path + '/page/index.html'))

app.get('/api', async (req, res) => {
  res.json(await music_data())
})

async function music_data() {
  const query = await su.get(`http://${YTMD_IP}/query`).timeout({deadline:1000}).catch(() => { return { status:500 }})
  const queue = await su.get(`http://${YTMD_IP}/query/queue`).timeout({deadline:1000}).catch(() => { return { status:500 }})
  if (query.status === 500) return { status:500, msg:'Service Offline' }
  return { query, queue }
}

srv.listen(PORT, () => console.log('http://localhost:' + PORT))
