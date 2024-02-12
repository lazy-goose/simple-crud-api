import 'dotenv/config'

import createServer from './createServer'

import http from 'http'
import cluster, { Worker } from 'cluster'
import process from 'process'
import { availableParallelism } from 'os'
import { URL } from 'url'
import { BASE_URL, PORT as ENV_PORT, SignalType } from './constants'

const numCPUs = availableParallelism()

cluster.schedulingPolicy = cluster.SCHED_RR

if (cluster.isPrimary) {
    const workers: Worker[] = []
    for (let i = 1; i <= numCPUs; i++) {
        workers.push(cluster.fork({ WORKER_INDEX: i }))
    }
    let round = 1
    workers.forEach((worker) => {
        worker.on('message', (event) => {
            if (event.type === SignalType.Sync) {
                // Broadcast to each worker
                workers.forEach((w) =>
                    w.send({ type: SignalType.Update, data: event.data }),
                )
            }
        })
    })
    http.createServer(async (req, res) => {
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
