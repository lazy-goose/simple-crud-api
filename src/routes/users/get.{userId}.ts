import defineRoute from '../../utils/defineRoute'
import { UserValidation, getUser } from '../../db.users'
import { messages } from '../../errors'

/**
 * @description
 * **GET** `api/users/{userId}`:
 *   - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
 *   - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
 *   - Server should answer with `status code` **200** and record with `id === userId` if it exists
 */
export default defineRoute((_, res, vars) => {
    const { userId } = vars
    if (!UserValidation.isUuid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                error: messages.userWrongId(userId),
            }),
        )
        return
    }
    const user = getUser({ id: userId })
    if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                error: messages.userNotFound(userId),
            }),
        )
        return
    }
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(user))
})
