import { cache } from '../data/cache'
import dayjs from 'dayjs'
import {
  agentStore as store,
  currDate,
  createCacheId,
  filterIpInRange
} from '../utils'

export const registerEvents = (connection, socket) => {
  connection.on('agent_connected', isLogout => {
    const date = dayjs(currDate()).format('YYYY/MM/DD HH:mm:ss')

    console.log(`-----\nAgent "${connection.id}" connected @ ${date}`)

    if (!isLogout) {
      store.addAgent('', connection.id)
        .then(cacheId => {
          if (!cacheId) {
            socket.to(`${connection.id}`)
              .emit('get_agent_data', true)
          }
        })
    }
  })

  connection.on('agent_data', data => {
    const { nicInfo, username } = data
    const { address, mac } = filterIpInRange(nicInfo)

    store.addCacheId(connection.id, createCacheId(`${mac}_${username}`))
      .then(cacheId => {
        cache.save(cacheId, {
          connectionId: connection.id,
          ip: address,
          username
        })
      })
  })

  connection.on('agent_logout', ({ nicInfo, username }) => {
    const connections = socket.of('/')
      .connected
    const { mac } = filterIpInRange(nicInfo)
    const cacheId = createCacheId(`${mac}_${username}`)

    if (!store.get(cacheId, '')) {
      connections[`${connection.id}`].disconnect(true)

      return
    }

    store.addAgent(cacheId, connection.id)
      .then(cache.getBy)
      .then(({ connectionId }) => {
        console.log(`Logging Out "${connectionId}; ${connection.id};"`)

        if (connection) {
          connections[`${connectionId}`].disconnect(true)
        }

        connections[`${connection.id}`].disconnect(true)
      })
      .catch(console.error)
  })

  connection.on('disconnect', reason => {
    const agent = store.get('', connection.id)

    if (agent && agent.cacheId) {
      const { connected } = socket.of('/')
      const socketConnections = Object.keys(connected)

      setTimeout(() => {
        if (!socketConnections.includes(connection.id)) {
          store.delConnection(agent.cacheId, connection.id)

          if (!agent.connections.length) {
            store.delAgent(agent.cacheId)
              .then(() => {
                cache.del(agent.cacheId)
              })
          }
        }
      }, 2500)
    }
  })
}
