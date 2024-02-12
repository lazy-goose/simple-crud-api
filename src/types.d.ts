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

export type User = {
    /** @description id — unique identifier (string, uuid) generated on server side */
    id: string
    /** @description username — user's name (string, required) */
    username: string
    /** @description age — user's age (number, required) */
    age: number
    /** @description hobbies — user's hobbies (array of strings or empty array, required)*/
    hobbies: string[]
}
