import { describe, test, expect } from 'vitest'
import { BASE_URL, TEST_PORT as PORT } from '../constants'
import type { User } from '../types.d'

describe('Scenario 3. Robot', () => {
    const url = new URL('/api/users', BASE_URL)
    url.port = String(PORT)

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    let createdUsers: User[] = []

    const withId = (id: string) => [url.href, id].join('/')

    const generateCreate = (id: number) => ({
        username: 'Bot' + id,
        age: id,
        hobbies: [],
    })

    const generateUpdate = (id: number) => ({
        username: 'Bot' + id,
        age: id,
        hobbies: [],
    })

    test('1. Should be no users', async () => {
        const response = await fetch(url, {
            method: 'GET',
        })
        const data = await response.json()
        expect(response.status).toEqual(200)
        expect(data).toEqual([])
    })

    test('2. Should create 10 users', async () => {
        const responses = await Promise.all(
            Array.from({ length: 10 }).map((_, gen) =>
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(generateCreate(gen)),
                }),
            ),
        )
        createdUsers = await Promise.all(responses.map((r) => r.json()))
        expect(responses.every((r) => r.status === 201)).toBe(true)
        expect(responses.length).toBe(10)
    })

    test('3. Should update 10 users', async () => {
        const responses = await Promise.all(
            createdUsers.map(({ id }, gen) =>
                fetch(withId(id), {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(generateUpdate(gen)),
                }),
            ),
        )
        expect(responses.every((r) => r.status === 200)).toBe(true)
    })

    test('4. Should delete 5 users', async () => {
        const responses = await Promise.all(
            createdUsers.slice(0, 5).map(({ id }) =>
                fetch(withId(id), {
                    method: 'DELETE',
                }),
            ),
        )
        expect(responses.every((r) => r.status === 204)).toBe(true)
    })

    test('5. Should be 5 users left', async () => {
        const response = await fetch(url, {
            method: 'GET',
        })
        const data = await response.json()
        expect(response.status).toEqual(200)
        expect(data).toHaveLength(5)
    })
})
