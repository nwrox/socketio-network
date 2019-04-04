import { initSocket, sendData, socketEvents } from './socket'
import { getAgentData, loadEnv } from './utils'

loadEnv().then(({ SOCKET_ADDR }) => initSocket(SOCKET_ADDR))
  .then(socket => sendData(socket, 'agent_data', getAgentData()))
  .then(socket => {
    const { dataCollection } = socketEvents

    dataCollection(socket, getAgentData)
  }).catch(console.error)
