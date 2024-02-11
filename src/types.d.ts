import { type RequestListener } from 'http'

export type HTTPMethod =
    | 'CONNECT'
    | 'DELETE'
    | 'GET'
    | 'HEAD'
    | 'OPTIONS'
    | 'PATCH'
    | 'POST'
    | 'PUT'
    | 'TRACE'

export type RouteHandler = (
    ...args: [...Parameters<RequestListener>, vars: Record<string, string>]
) => void

export type RouteDefinition = {
    method: HTTPMethod | HTTPMethod[]
    match: string | RegExp
    route: RouteHandler
}
