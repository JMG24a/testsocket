const { config } = require("../config/config")
const { socketEvents } = require("../constants/socket-events")
const socketIO = require('socket.io')
const socket = {};

const appSocket = (server) =>{
  socket.io = socketIO(server,{
    cors:{
      origin: "https://app.formuapp.com",
      methods: ["GET","POST"]
    }
  })

  socket.io.on(socketEvents.connect, socket => {
    console.log(socket.id)

    socket.on(socketEvents.disconnect, () => {
      console.log(socket.id)
    })

    socket.on(socketEvents.company.room, (data) => {
      console.log(data)
      socket.join(data)
    })
  })
}

module.exports = {appSocket, socket}
