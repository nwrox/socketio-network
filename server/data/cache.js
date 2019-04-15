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
  save: (ip, data) => {
    const client = initClient()

    client.set(`${ip}`, JSON.stringify(data), redis.print)

    client.quit()
  }
}

const initClient = () => {
  const client = redis.createClient({
    host: '10.164.96.193',
    port: 16380
  })

  client.on('error', err => {
    console.log(`Error: ${err}`)
  })

  return client
}
