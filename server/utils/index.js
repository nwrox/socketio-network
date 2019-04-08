import dotenv from 'dotenv'

export const currDate = () => new Date().toLocaleString('pt-BR', {
  timeZone: 'America/Sao_Paulo'
})

export const loadEnv = () => new Promise((resolve, reject) => {
  const { error, parsed } = dotenv.config()

  if (error) {
    reject(error)
  }

  resolve(parsed)
})

// min c# date
export const minDate = () => new Date(1, 1, 1, 12).toISOString()
