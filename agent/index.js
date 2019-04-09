import { initSocket, registerEvents, sendData } from './socket'
import { getAgentData, loadEnv } from './utils'

loadEnv().then(({ SOCKET_ADDR }) => initSocket(SOCKET_ADDR))
  .then(socket => {
    const args = process.argv
      .filter(arg => arg === '--logout')

    return args.length
      ? sendData(socket, 'agent_logout', getAgentData().ip_addresses)
      : sendData(socket, 'agent_data', getAgentData())
  })
  .then(socket => registerEvents(socket))
  .catch(console.error)
