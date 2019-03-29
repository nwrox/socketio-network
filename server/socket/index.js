import io from 'socket.io'

export const socketPlugin = {
  name: 'socketioPlugin',
  register: (server, options) => {
    const socket = io(server.listener)

    socket.on('connection', client => {
      console.log(`connection from ${client.id}`)

      client.on('agent_data', data => {
        console.log(data)
      })
    })

    server.expose({ socket })
  }
}
