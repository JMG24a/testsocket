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
    console.log(socket.id)

    socket.on(socketEvents.disconnect, () => {
      console.log(socket.id)
    })

    socket.on(socketEvents.company.room, (data) => {
      console.log('%cMyProject%cline:20%cdata', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px', data)
      socket.join(data)
    })
  })
}

module.exports = {appSocket, socket}
