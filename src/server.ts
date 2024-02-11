import { createServer } from 'http'
import createRouter from './utils/createRouter'

const router = createRouter([])

const PORT = process.env.PORT

createServer(router).listen(PORT, () => {
    console.log(`Server successfully started on port: ${PORT}`)
})
