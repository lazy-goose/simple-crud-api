import { createServer } from 'http'
import createRouter from './utils/createRouter'

import getUsers from './routes/users/get'
import getUsersByUserId from './routes/users/get.{userId}'
import postUsers from './routes/users/post'
import putUsersByUserId from './routes/users/put.{userId}'
import deleteUsersByUserId from './routes/users/delete.{userId}'
import notFound from './routes/notFound'
import serverError from './routes/serverError'

const router = createRouter(
    [
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
    ],
    {
        unhandledMatchRoute: notFound,
        errorRoute: serverError,
    },
)

export default () => createServer(router)
