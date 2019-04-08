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

const getEnvPath = () => {
  const { NODE_ENV } = process.env

  return NODE_ENV !== 'development'
    ? path.resolve(__dirname, '../.env')
    : path.resolve(process.cwd(), '.env')
}

const getUsername = () => userInfo().username

const getPlainNetworkInterfaces = nics => nics.reduce((acc, curr) => [...acc, ...curr], [])

export const loadEnv = () => new Promise((resolve, reject) => {
  const { error, parsed } = dotenv.config({
    path: getEnvPath()
  })

  if (error) {
    reject(error)
  }

  resolve(parsed)
})
