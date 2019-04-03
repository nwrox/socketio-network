export const registerEvents = (client, socket) => {
  client.on('agent_data', data => {
    console.log(data)
  })

  client.on('disconnect', reason => {
    console.log({ reason })
  })
}
