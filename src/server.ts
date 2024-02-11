import { createServer } from 'http'
import createRouter from './utils/createRouter'

import getUsers from './routes/users/get'
import getUsersByUserId from './routes/users/get.{userId}'
import postUsers from './routes/users/post'
import putUsersByUserId from './routes/users/put.{userId}'
import deleteUsersByUserId from './routes/users/delete.{userId}'

const router = createRouter([
    {
        method: 'GET',
        match: '/api/users',
        route: getUsers,
    },
    {
        method: 'GET',
        match: '/api/users/{userId}',
        route: getUsersByUserId,
    },
    {
        method: 'POST',
        match: '/api/users',
        route: postUsers,
    },
    {
        method: 'PUT',
        match: '/api/users/{userId}',
        route: putUsersByUserId,
    },
    {
        method: 'DELETE',
        match: '/api/users/{userId}',
        route: deleteUsersByUserId,
    },
])

const PORT = process.env.PORT

createServer(router).listen(PORT, () => {
    console.log(`Server successfully started on port: ${PORT}`)
})
