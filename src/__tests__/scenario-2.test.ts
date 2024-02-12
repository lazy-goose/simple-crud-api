import { describe, test, expect } from 'vitest'
import { BASE_URL, TEST_PORT as PORT } from '../constants'
import { UserValidation } from '../db.users'
import * as uuid from 'uuid'

describe('Scenario 2. Erroneous user', () => {
    const url = new URL('/api/users', BASE_URL)
    url.port = String(PORT)

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    let userId = '-1'

    const createData = {
        username: 'Fishee',
        age: 3,
        hobbies: ['Swim', 'Hide', 'Explore'],
    }

    const updateData = {
        username: 'Shark',
        age: 7,
        hobbies: ['Eat people'],
    }

    const withId = (id: string) => [url.href, id].join('/')

    test('1. Should create person', async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(createData),
        })
        const data = await response.json()
        expect(response.status).toBe(201)
        userId = data.id
    })

    test('2. Should fail update, wrong userId', async () => {
        const wrongId = userId + '$notallowed.symbols--'
        expect(UserValidation.isUuid(wrongId)).toBe(false)
        const response = await fetch(withId(wrongId), {
            method: 'PUT',
            headers,
            body: JSON.stringify(updateData),
        })
        expect(response.status).toBe(400)
    })

    test('3. Should fail update, no userId', async () => {
        const noUserId = uuid.v4()
        const response = await fetch(withId(noUserId), {
            method: 'PUT',
            headers,
            body: JSON.stringify(updateData),
        })
        expect(response.status).toBe(404)
    })

    test('4. Should update person', async () => {
        const response = await fetch(withId(userId), {
            method: 'PUT',
            headers,
            body: JSON.stringify(updateData),
        })
        expect(response.status).toBe(200)
    })

    test('5. Should fail get users, wrong link', async () => {
        const wrongUrl = new URL(`/api/user_/${userId}`, url)
        const response = await fetch(wrongUrl, {
            method: 'GET',
        })
        expect(response.status).toBe(404)
    })

    test('6. Should contain in users', async () => {
        const response = await fetch(withId(userId), {
            method: 'GET',
        })
        const data = await response.json()
        expect(response.status).toBe(200)
        expect(data).toEqual({ id: userId, ...updateData })
    })
})
