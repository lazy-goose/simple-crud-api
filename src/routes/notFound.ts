import defineRoute from '../utils/defineRoute'

export default defineRoute((_, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(
        JSON.stringify({
            message: `LazyGoosy... We do not support such url`,
        }),
    )
})
