#!/usr/bin/env node

const { Client } = require("ssh2")
const config = require('./config.json')

for (let ip of config.IP_LIST) {
  connect(ip)
}

function connect (ip) {
  const conn = new Client()

  conn.on('ready', () => {
    conn.exec(ip.COMMAND, (err, stream) => {
      if (err) { throw new Error(err) }
    
      stream.on('close', (code, signal) => {
        conn.end()
      })
    
      .on('data', data => {
        console.log(data.toString())
      })
    
      .stderr.on('data', data => {
        console.log('err:', data.toString())
      })
    })
  })

  .connect({
    host: ip.ip,
    port: 22,
    username: ip.username,
    password: ip.password
  })
}
