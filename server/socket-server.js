const { config } = require("../config/config")
const { socketEvents } = require("../constants/socket-events")
const socketIO = require('socket.io')
const socket = {};

const appSocket = (server) =>{
  socket.io = socketIO(server,{
    cors:{
      origin: "*",
      methods: ["GET","POST"]
    }
  })

  socket.io.on(socketEvents.connect, socket => {
    console.log('conexion de socket exitosa')

    socket.on(socketEvents.disconnect, () => {
      console.log(socket.id)
    })

    socket.on(socketEvents.company.room, (data) => {
      console.log(data)
      socket.join(data)
    })

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  })
}

module.exports = {appSocket, socket}
