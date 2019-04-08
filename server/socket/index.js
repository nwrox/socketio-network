import dayjs from 'dayjs'
import { registerEvents } from './events'
import io from 'socket.io'
import { currDate } from '../utils'

export const socketPlugin = {
  name: 'socketioPlugin',
  register: (server, options) => {
    const socket = io(server.listener)

    socket.on('connection', client => {
      const date = dayjs(currDate()).format('YYYY/MM/DD HH:mm:ss')

      console.log(`Client "${client.id}" connected @ ${date}`)

      registerEvents(client, socket)
    })

    server.expose({ socket })
  }
}
