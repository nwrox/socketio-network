import dotenv from 'dotenv'
import { networkInterfaces, userInfo } from 'os'
import path from 'path'

export const getAgentData = () => {
  return ({
    nicInfo: getNicInfo(),
    username: getUsername()
  })
}

const getEnvPath = () => {
  const { NODE_ENV } = process.env

  return NODE_ENV !== 'development'
    ? path.resolve(__dirname, '../../.env')
    : path.resolve(process.cwd(), '.env')
}

const getNicInfo = () => getPlainNetworkInterfaces(networkInterfaces())
  .filter(({ family, internal }) => family === 'IPv4' && !internal)
  .map(({ address, mac }) => ({ address, mac }))

const getPlainNetworkInterfaces = nics => Object.values(nics)
  .reduce((acc, curr) => [...acc, ...curr], [])

const getUsername = () => userInfo().username

export const loadEnv = () => new Promise((resolve, reject) => {
  const { error, parsed } = dotenv.config({
    path: getEnvPath()
  })

  if (error) {
    reject(error)
  }

  resolve(parsed)
})
