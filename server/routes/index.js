import { getAll, getLastBy } from '../data/session'

export const buildRoutes = server => {
  const routes = [{
    method: 'GET',
    path: '/agents',
    handler: ({ query }, h) => {
      const { currPage, perPage } = query

      return getAll(currPage, perPage)
    }
  },
  {
    method: 'GET',
    path: '/agent',
    handler: ({ query }, h) => {
      const { login, ip, isWebSession } = query

      return getLastBy(login, ip, isWebSession)
    }
  }]

  routes.forEach(route => {
    server.route(route)
  })
}

// socket.broadcast
//   .emit('get_agent_data', '')
