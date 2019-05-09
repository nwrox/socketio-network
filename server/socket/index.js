import { registerEvents } from './events'
import io from 'socket.io'

export const socketPlugin = {
  name: 'socketioPlugin',
  register: (server, options) => {
    const socket = io(server.listener)

    socket.on('connection', connection => {
      registerEvents(connection, socket)
    })

    server.expose({ socket })
  }
}
