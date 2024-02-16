import { beforeAll } from 'vitest'
import { replaceDb } from '../db.users'
import createServer from '../createServer'
import { TEST_PORT } from '../constants'

beforeAll(() => {
    replaceDb([])
    createServer().listen(TEST_PORT)
})
