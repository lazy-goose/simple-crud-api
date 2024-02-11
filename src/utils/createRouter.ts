import { RequestListener } from 'http'
import { RouteDefinition } from '../types'

const createRouter = (
    routes: RouteDefinition[],
    fallback?: RequestListener,
): RequestListener => {
    const parseVariable = <T>(
        str: T,
    ): {
        value: T
        isVar: boolean
        isOpt: boolean
    } => {
        if (typeof str !== 'string') {
            return {
                value: str,
                isVar: false,
                isOpt: false,
            }
        }
        if (str.startsWith('{') && str.endsWith('}')) {
            return {
                value: str.replace(/^\{(.*)=?\}$/, '$1') as T,
                isVar: true,
                isOpt: str.endsWith('=}'),
            }
        }
        return {
            value: str,
            isVar: false,
            isOpt: false,
        }
    }
    return (req, res) => {
        let vars: Record<string, string> = {}
        const matchedRoute = routes.find(({ method, match }) => {
            if (!req.url) {
                return false
            }
            // Method check
            if (typeof method === 'string' && method !== req.method) {
                return false
            }
            if (Array.isArray(method) && !method.some((m) => m == req.method)) {
                return false
            }
            // Match check
            if (match instanceof RegExp) {
                return req.url.match(match)
            }
            if (typeof match === 'string') {
                const split = (str: string) => str.split('/').filter(Boolean)

                const matchPaths = split(match)
                const reqPaths = split(req.url)

                const pool = [...reqPaths].reverse()

                let optLength = matchPaths
                    .map(parseVariable)
                    .reduce((sum, v) => sum + +v.isOpt, 0)

                for (let i = 0; i < matchPaths.length; i++) {
                    const { value, isVar, isOpt } = parseVariable(matchPaths[i])
                    if (isVar) {
                        if (isOpt) {
                            const hasToReplace = pool.length - optLength
                            if (hasToReplace > 0) {
                                vars[value] = pool.pop() as string
                                optLength--
                            }
                            continue
                        }
                        vars[value] = pool.pop() as string
                        continue
                    }
                    if (matchPaths[i] !== reqPaths[i]) {
                        pool.pop()
                        continue
                    }
                    return false
                }

                if (pool.length === optLength) {
                    vars = {}
                    return false
                }

                return true
            }
            return false
        })
        if (!matchedRoute) {
            if (!fallback) {
                throw new Error('Unhandled route')
            }
            return fallback(req, res)
        }
        return matchedRoute.route(req, res, vars)
    }
}

export default createRouter
