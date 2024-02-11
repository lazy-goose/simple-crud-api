import defineRoute from '../../utils/defineRoute'
import { getAllUsers } from '../../db.users'

/**
 * @description
 * **GET** `api/users` is used to get all persons:
 *   - Server should answer with `status code` **200** and all users records
 */
export default defineRoute((_, res) => {
    const users = getAllUsers()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(users))
})
