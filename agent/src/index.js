import { initSocket, registerEvents, sendData } from './socket'
import { getAgentData, loadEnv } from './utils'

loadEnv().then(({ SOCKET_ADDR }) => initSocket(SOCKET_ADDR))
  .then(registerEvents)
  .then(socket => {
    const args = process.argv
    const evt = args.includes('--logout')
      ? 'agent_logout'
      : 'agent_data'

    sendData(socket, evt, getAgentData())
  })
  .catch(err => {
    console.log({ err })
  })
