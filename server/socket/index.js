import dayjs from 'dayjs'
import { registerEvents } from './events'
import io from 'socket.io'

export const socketPlugin = {
  name: 'socketioPlugin',
  register: (server, options) => {
    const socket = io(server.listener)

    socket.on('connection', client => {
      const date = dayjs().format('YYYY/MM/DD HH:mm:ss')

      console.log(`connectclientn from ${client.id} @ ${date}`)

      registerEvents(client, socket)
    })

    server.expose({ socket })
  }
}
