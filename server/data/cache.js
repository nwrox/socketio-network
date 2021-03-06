import redis from 'redis'

export const cache = {
  del: key => {
    const client = initClient()

    client.del(key)
    client.quit()
  },
  getBy: key => {
    const client = initClient()
    const promise = new Promise((resolve, reject) => {
      client.get(key, (err, reply) => {
        if (err) {
          reject(err)
        }

        resolve(JSON.parse(reply))
      })
    })

    return promise.finally(() => {
      client.quit()
    })
  },
  save: (key, data) => {
    const client = initClient()
    const value = typeof data !== 'string'
      ? JSON.stringify(data)
      : data

    client.set(`${key}`, value, () => {})

    client.quit()
  }
}

const initClient = () => {
  const { REDIS_PORT, REDIS_HOST } = process.env
  const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
  })

  client.on('error', err => {
    console.log(`Cache error: ${err}`)
  })

  return client
}
