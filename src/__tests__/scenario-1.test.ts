import { describe, test, expect } from 'vitest'
import { BASE_URL, TEST_PORT as PORT } from '../constants'
import { UserValidation } from '../db.users'

describe('Scenario 1. Advanced user', () => {
    const url = new URL('/api/users', BASE_URL)
    url.port = String(PORT)

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    let userId = '-1'

    const createData = {
        username: 'Kitty',
        age: 10,
        hobbies: ['Eat', 'Sleep', 'Meow'],
    }

    const updateData = {
        username: 'Doggy',
        age: 7,
        hobbies: ['Bark', 'Jump', 'Pee'],
    }

    const withId = (id: string) => [url.href, id].join('/')

    test('1. Should return no person', async () => {
        const response = await fetch(url, {
            method: 'GET',
        })
        const data = await response.json()
        expect(response.status).toEqual(200)
        expect(data).toEqual([])
    })

    test('2. Should create person', async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(createData),
        })
        const data = await response.json()
        expect(response.status).toBe(201)
        expect(UserValidation.isUser(data)).toBe(true)
        userId = data.id
    })

    test('3. Should get person', async () => {
        const response = await fetch(withId(userId), {
            method: 'GET',
        })
        const data = await response.json()
        expect(response.status).toBe(200)
        expect(data).toEqual({ id: userId, ...createData })
    })

    test('4. Should update person', async () => {
        const response = await fetch(withId(userId), {
            method: 'PUT',
            headers,
            body: JSON.stringify(updateData),
        })
        const data = await response.json()
        expect(response.status).toBe(200)
        expect(data).toEqual({ id: userId, ...updateData })
    })

    test('5. Should delete person', async () => {
        const response = await fetch(withId(userId), {
            method: 'DELETE',
        })
        expect(response.status).toBe(204)
    })

    test('6. Should find no person', async () => {
        const response = await fetch(withId(userId), {
            method: 'GET',
        })
        expect(response.status).toBe(404)
    })
})
