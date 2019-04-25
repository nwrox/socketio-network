import dotenv from 'dotenv'
import ip from 'ip'

export const currDate = () => new Date().toLocaleString('pt-BR', {
  timeZone: 'America/Sao_Paulo'
})

export const filterIpInRange = ipArr => {
  const { NETWORK_RANGE } = process.env

  return ipArr.filter(i => ip.cidrSubnet(NETWORK_RANGE)
    .contains(i)
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
