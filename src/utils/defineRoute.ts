import { RouteHandler } from '../types.d'

const defineRoute = <T extends RouteHandler>(annotate: T) => annotate

export default defineRoute
