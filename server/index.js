import Hapi from 'hapi'
import { socketPlugin } from './socket'

const initServer = server => server.start()

const registerPlugins = server => server.register(socketPlugin)

const server = Hapi.server({
  host: 'localhost',
  port: 3000
})

registerPlugins(server).then(() => initServer(server))
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
