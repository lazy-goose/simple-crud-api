export const BASE_URL = 'http://127.0.0.1'
export const PORT = Number(process.env.PORT) || 4000

export enum SignalType {
    Sync = 'sync',
    Update = 'update',
}
