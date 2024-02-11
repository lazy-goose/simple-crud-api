import defineRoute from '../../utils/defineRoute'
import { UserValidation, createUser } from '../../db.users'
import parseJsonBody from '../../utils/parseJsonBody'

/**
 * @description
 * **POST** `api/users` is used to create record about new user and store it in database:
 *   - Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
 *   - Server should answer with `status code` **201** and newly created record
 */
export default defineRoute(async (req, res) => {
    const { value: parsed } = await parseJsonBody(req)
    if (!UserValidation.isUser(parsed, { id: false })) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                error: `Invalid input: expected a valid JSON with UserData schema`,
                UserData: {
                    'username!': 'string',
                    'age!': 'number Int',
                    'hobbies!': 'string[]',
                },
            }),
        )
        return
    }
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(createUser(parsed)))
})
