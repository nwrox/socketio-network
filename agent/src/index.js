import { initSocket, registerEvents, sendData } from './socket'
import { getAgentData, loadEnv } from './utils'

loadEnv().then(({ SOCKET_ADDR }) => initSocket(SOCKET_ADDR))
  .then(registerEvents)
  .then(socket => {
    const args = process.argv
    const data = getAgentData()

    return args.includes('--logout')
      ? sendData(socket, 'agent_logout', data.ip_addresses)
      : sendData(socket, 'agent_data', data)
  })
  .catch(console.error)
