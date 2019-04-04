import Hapi from 'hapi'
import { socketPlugin } from './socket'
import { loadEnv } from './utils'

const initServer = server => server.start()

const registerPlugins = server => server.register(socketPlugin)

const server = Hapi.server({
  host: '0.0.0.0',
  port: 3000
})

loadEnv().then(() => registerPlugins(server))
  .then(() => initServer(server))
  .then(() => {
    const {
      info: {
        uri: serverInfo
      }
    } = server

    console.log(`Server running at: ${serverInfo}`)
  }).catch(console.error)

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})
