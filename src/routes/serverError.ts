import type { RouteErrorHandler } from '../types.d'
import defineRoute from '../utils/defineRoute'

export default defineRoute<RouteErrorHandler>((_, res, error) => {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(
        JSON.stringify({
            error: error instanceof Error ? error.message : error,
            message: 'Sorry... Unhandled error occurs on the server',
        }),
    )
})
