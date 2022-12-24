const { config } = require("../config/config")
const { socketEvents } = require("../constants/socket-events")
const socketIO = require('socket.io')
const socket = {};

const appSocket = (server) =>{
  socket.io = socketIO(server,{
    cors:{
      origin: config.socket,
      methods: ["GET","POST"]
    }
  })

  socket.io.on(socketEvents.connect, socket => {
    console.log(socket.id)

    socket.on(socketEvents.disconnect, () => {
      console.log(socket.id)
    })

    socket.on(socketEvents.company.room, (data) => {
      socket.join(data)
    })
  })
}

module.exports = {appSocket, socket}
