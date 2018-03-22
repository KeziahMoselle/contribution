'use strict'

const https = require('https')

module.exports = (username, callback) => {
  callback = callback || function () {}

  return new Promise((resolve, reject) => {
    const url = `https://github.com/users/${username}/contributions`

    const success = response => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', chunk => { body += chunk })
      response.on('end', () => { parse(body) })
    }

    const parse = body => {
      const matches = []
      const regex = /data-count="(.*?)"/g

      let match
      while ((match = regex.exec(body))) matches.push(match)

      let contributions = 0
      let streak = 0
      matches.forEach(match => {
        const count = parseInt(match[1])
        if (count > 0) streak++; else streak = 0
        contributions += count
      })

      const data = { contributions, streak }
      resolve(data)
      return callback(data)
    }
    https.get(url, success)
  })
}
