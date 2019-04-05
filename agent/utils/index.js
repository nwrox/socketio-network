import dotenv from 'dotenv'
import { networkInterfaces, userInfo } from 'os'
import path from 'path'

const getIpAddresses = () => getPlainNetworkInterfaces(Object.values(networkInterfaces()))
  .filter(({ family, internal }) => family === 'IPv4' && !internal)
  .map(({ address }) => address)

export const getAgentData = () => ({
  ip_addresses: getIpAddresses(),
  username: getUsername()
})

const getUsername = () => userInfo().username

const getPlainNetworkInterfaces = nics => nics.reduce((acc, curr) => [...acc, ...curr], [])

export const loadEnv = () => new Promise((resolve, reject) => {
  const { error, parsed } = dotenv.config({
    path: path.resolve(__dirname, '../.env')
  })

  if (error) {
    reject(error)
  }

  resolve(parsed)
})
