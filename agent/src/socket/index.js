import io from 'socket.io-client'
import { getAgentData } from '../utils'

export const initSocket = url => io(url)

export const registerEvents = socket => {
  socket.on('connect', () => {
    const args = process.argv

    sendData(socket, 'agent_connected', args.includes('--logout'))
  })

  socket.on('get_agent_data', () => {
    sendData(socket, 'agent_data', getAgentData())
  })

  return socket
}

export const sendData = (socket, evt, data) => {
  socket.emit(evt, data)

  return socket
}
