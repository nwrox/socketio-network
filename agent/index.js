import { initSocket, registerEvents, sendData } from './socket'
import { getAgentData, loadEnv } from './utils'

loadEnv().then(({ SOCKET_ADDR }) => initSocket(SOCKET_ADDR))
  .then(socket => sendData(socket, 'agent_data', getAgentData()))
  .then(socket => registerEvents(socket))
  .catch(console.error)
