import io from 'socket.io-client'

export const initSocket = url => io(url)

export const sendData = (socket, evt, data) => {
  socket.emit(evt, data)

  return socket
}

export const socketEvents = {
  dataCollection: (socket, getData) => {
    socket.on('get_agent_data', () => {
      sendData(socket, 'agent_data', data)
    })
  }
}
