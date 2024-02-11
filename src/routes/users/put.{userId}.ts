import defineRoute from '../../utils/defineRoute'
import { UserValidation, updateUser } from '../../db.users'
import { messages } from '../../errors'
import parseJsonBody from '../../utils/parseJsonBody'

/**
 * @description
 * **PUT** `api/users/{userId}` is used to update existing user:
 *   - Server should answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
 *   - Server should answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
 *   - Server should answer with` status code` **200** and updated record
 */
export default defineRoute(async (req, res, vars) => {
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
    const { value: parsed } = await parseJsonBody(req)
    if (!UserValidation.satisfiesUser(parsed)) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                error: `Invalid input: expected a valid JSON with UserUpdate schema`,
                UserUpdate: {
                    'username?': 'string',
                    'age?': 'number Int',
                    'hobbies?': 'string[]',
                },
            }),
        )
        return
    }
    const user = updateUser({ id: userId, ...parsed })
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
