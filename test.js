const io = require('socket.io-client')
const socket = io('http://localhost:8080')

setInterval(() => {

  console.log(socket.connected)
}, 1000);

socket.on("connect", () => {
    console.log("connected")
})

socket.on("disconnect", () => {
    console.log("disconnected")
})

socket.on("data", (data) => {
    console.log(data)
});