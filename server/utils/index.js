import { createHash } from 'crypto'
import dotenv from 'dotenv'
import ip from 'ip'

export const agentStore = {
  agents: [],
  addCacheId (clientId, cacheId) {
    const { agents } = this
    const index = this._findAgentIndex('', clientId)

    Object.assign(agents[index], { cacheId })

    this.agents = [...agents]

    return Promise.resolve(cacheId)
  },
  addAgent (cacheId, connectionId) {
    const { agents } = this

    if (!cacheId) {
      const connections = [connectionId]

      this.agents = [...agents, {
        cacheId: '',
        connections
      }]

      const cli = this.get('', connectionId)

      return new Promise(resolve => setTimeout(() => resolve(cli.cacheId), 30000))
    }

    const index = this._findAgentIndex(cacheId)

    agents[index]
      .connections
      .push(connectionId)

    this.agents = [...agents]

    return Promise.resolve(cacheId)
  },
  delAgent (cacheId) {
    const { agents } = this
    const index = this._findAgentIndex(cacheId, '')

    agents.splice(index, 1)

    this.agents = [...agents]

    return Promise.resolve(!this.agents[index])
  },
  delConnection (cacheId, connectionId) {
    const { agents } = this
    const agIndex = this._findAgentIndex(cacheId, '')
    const connIndex = agents[agIndex].connections
      .findIndex(conn => conn === connectionId)

    agents[agIndex].connections
      .splice(connIndex, 1)

    this.agents = [...agents]
  },
  _findAgentIndex (cacheId, connectionId) {
    return this.agents
      .findIndex(ag => ag.cacheId === cacheId || ag.connections.includes(connectionId))
  },
  getAgent (cacheId, connectionId) {
    const index = this._findAgentIndex(cacheId, connectionId)

    return this.agents[index]
  }
}

export const createCacheId = data => createHash('sha256')
  .update(data)
  .digest('hex')

export const currDate = () => new Date().toLocaleString('pt-BR', {
  timeZone: 'America/Sao_Paulo'
})

export const filterIpInRange = nicInfo => {
  const { NETWORK_RANGE } = process.env

  return nicInfo.filter(({ address }) => ip.cidrSubnet(NETWORK_RANGE)
    .contains(address)
  )[0]
}

export const loadEnv = () => new Promise((resolve, reject) => {
  const { error, parsed } = dotenv.config()

  if (error) {
    reject(error)
  }

  resolve(parsed)
})

export const minDate = () => new Date('0001-01-01').toISOString()
