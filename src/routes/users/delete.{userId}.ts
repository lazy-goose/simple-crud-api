import defineRoute from '../../utils/defineRoute'
import { UserValidation, deleteUser } from '../../db.users'
import { messages } from '../../errors'

/**
 * @description
 * **DELETE** `api/users/{userId}` is used to delete existing user from database:
 *   - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
 *   - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
 *   - Server should answer with `status code` **204** if the record is found and deleted
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
    const user = deleteUser({ id: userId })
    if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                error: messages.userNotFound(userId),
            }),
        )
        return
    }
    // 204 doesn't have body
    res.writeHead(204, { 'Content-Type': 'application/json' })
    res.end()
})
