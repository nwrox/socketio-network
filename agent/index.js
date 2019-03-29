import io from 'socket.io-client'
import { networkInterfaces, userInfo } from 'os'

const socket = io(process.env.SOCKET_ADDR)

const getIpAddresses = () => getPlainNetworkInterfaces(Object.values(networkInterfaces()))
  .filter(({ family, internal }) => family === 'IPv4' && !internal)
  .map(({ address }) => address)

const getAgentData = () => ({
  ip_addresses: getIpAddresses(),
  username: getUsername(),
})

const getUsername = () => userInfo().username

const getPlainNetworkInterfaces = nics => nics.reduce((acc, curr) => [...acc, ...curr], [])

socket.emit('agent_data', getAgentData())

socket.on('get_agent_data', () => {
  socket.emit('agent_data', getAgentData())
})
