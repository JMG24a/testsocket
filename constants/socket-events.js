const socketEvents = {
  connect: "connection",
  disconnect: "disconnect",
  company: {
    room: "connect to company room",
    update: "update company",
  }
}

module.exports = {
  socketEvents
}
