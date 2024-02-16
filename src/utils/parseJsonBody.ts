import { type IncomingMessage } from 'http'

type SuccessData = {
    value: Record<string, unknown>
    error: null
}

type ErrorData = {
    value: null
    error: Error
}

const parseJsonBody = (
    incomingMessage: IncomingMessage,
): Promise<SuccessData | ErrorData> => {
    return new Promise((res) => {
        const chunks: Uint8Array[] = []
        incomingMessage.on('data', (chunk) => {
            chunks.push(chunk)
        })
        const onError = () => {
            res({
                value: null,
                error: new Error('Invalid input: unable to parse'),
            })
        }
        incomingMessage.on('end', () => {
            const data = Buffer.concat(chunks).toString()
            try {
                res({
                    value: JSON.parse(data),
                    error: null,
                })
            } catch {
                onError()
            }
        })
        incomingMessage.on('error', () => {
            onError()
        })
    })
}

export default parseJsonBody
