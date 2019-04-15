import { cache } from '../data/cache'
import { filterIpInRange } from '../utils'

export const registerEvents = (client, socket) => {
  client.on('agent_data', data => {
    const ip = filterIpInRange(data.ip_addresses)

    cache.save(ip, {
      clientId: client.id,
      user: data.username
    })
  })

  client.on('agent_logout', ipAddrs => {
    console.log(`Logging Out "${client.id}"`)

    const clients = socket.of('/')
      .connected
    const ip = filterIpInRange(ipAddrs)

    cache.getBy(ip)
      .then(({ clientId }) => {
        console.log(clientId)

        clients[`${clientId}`].disconnect(true)
        clients[`${client.id}`].disconnect(true)
      })
      .catch(console.error)
  })

  client.on('disconnect', reason => {
    console.log(`Client "${client.id}" disconnected: Reason "${reason}"`)
  })
}
