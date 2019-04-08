export const registerEvents = (client, socket) => {
  client.on('agent_data', data => {
    console.log(data)
  })

  client.on('agent_logout', ipAddrs => {
    console.log(`Logging Out "${client.id}"`)

    console.log(ipAddrs)

    const clients = socket.of('/')
      .connected

    clients[`${client.id}`].disconnect(true)
  })

  client.on('disconnect', reason => {
    console.log(`Client "${client.id}" disconnected: Reason "${reason}"`)
  })
}
