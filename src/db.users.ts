import uuid from 'uuid'
import { type User } from './types.d'

const inMemoryDataBase: User[] = []

const createUser = ({
    age,
    username,
    hobbies,
}: Omit<User, 'id'>): Readonly<User> => {
    const user = {
        id: uuid.v4(),
        age,
        username,
        hobbies,
    }
    inMemoryDataBase.push(user)
    return user
}
const updateUser = ({
    id,
    ...merge
}: Pick<User, 'id'> & Partial<User>): Readonly<User> | undefined => {
    const index = inMemoryDataBase.findIndex((u) => u.id === id)
    if (index === -1) {
        return undefined
    }
    const user = inMemoryDataBase[index]
    for (const [key, value] of Object.entries(merge)) {
        if (Object.hasOwn(user, key)) {
            ;(user as Record<string, unknown>)[key] = value
        }
    }
    return user
}
const deleteUser = ({ id }: Pick<User, 'id'>): Readonly<User> | undefined => {
    const index = inMemoryDataBase.findIndex((u) => u.id === id)
    if (index === -1) {
        return undefined
    }
    return inMemoryDataBase.splice(index, 1)[0]
}

const getUser = ({ id }: Pick<User, 'id'>): Readonly<User> | undefined => {
    return inMemoryDataBase.find((u) => u.id === id)
}
const getAllUsers = (): Readonly<User[]> => {
    return inMemoryDataBase
}

export { createUser, updateUser, deleteUser, getUser, getAllUsers }
