import 'dotenv/config'

import createServer from './createServer'

const PORT = process.env.PORT

createServer().listen(PORT, () => {
    console.log(`Server successfully started on port: ${PORT}`)
})
