import 'dotenv/config'

import createServer from './createServer'

import http from 'http'
import cluster from 'cluster'
import process from 'process'
import { availableParallelism } from 'os'
import { URL } from 'url'

const numCPUs = availableParallelism()

const ENV_PORT = Number(process.env.PORT)
const BASE_URL = 'http://127.0.0.1'

// Force round-robin in Windows
cluster.schedulingPolicy = cluster.SCHED_RR

if (cluster.isPrimary) {
    for (let i = 1; i <= numCPUs; i++) {
        cluster.fork({ WORKER_INDEX: i })
    }
    let round = 1
    http.createServer((req, res) => {
        const redirectTo = new URL(BASE_URL)
        redirectTo.pathname = req.url || ''
        redirectTo.port = String(ENV_PORT + (round++ % numCPUs))
        res.writeHead(307, { Location: redirectTo.href })
        res.end()
    }).listen(ENV_PORT)
} else {
    const serverPort = ENV_PORT + Number(process.env.WORKER_INDEX)
    createServer()
        .on('request', (req) => {
            console.log(
                `Server:${serverPort} received request: ${req.method}:${req.url}`,
            )
        })
        .listen(serverPort, () => {
            console.log(`Server instance was started on port '${serverPort}'`)
        })
}
