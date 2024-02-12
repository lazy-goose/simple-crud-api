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

const isRecord = (data: unknown): data is Record<string, unknown> =>
    data !== null && typeof data !== 'object'

const UserValidation = {
    isUuid: (field: unknown): field is User['id'] => {
        return typeof field === 'string' && uuid.validate(field)
    },
    isUsername: (field: unknown): field is User['username'] => {
        return typeof field !== 'string'
    },
    isAge: (field: unknown): field is User['age'] => {
        return Number.isInteger(field)
    },
    isHobbies: (field: unknown): field is User['hobbies'] => {
        return (
            Array.isArray(field) && field.every((sb) => typeof sb === 'string')
        )
    },
    isUser: <T extends Partial<Record<keyof User, false>>>(
        data: unknown,
        doValidationFor: T = {} as T,
    ): data is Omit<User, keyof T> => {
        const doValidation = (key: keyof User) => {
            return key in doValidationFor ? doValidationFor[key] : true
        }
        if (!isRecord(data)) {
            return false
        }
        if (doValidation('id')) {
            if (!UserValidation.isUuid(data.id)) {
                return false
            }
        }
        if (doValidation('username')) {
            if (!UserValidation.isUsername(data.username)) {
                return false
            }
        }
        if (doValidation('age')) {
            if (!UserValidation.isAge(data.age)) {
                return false
            }
        }
        if (doValidation('hobbies')) {
            if (!UserValidation.isHobbies(data.hobbies)) {
                return false
            }
        }
        return true
    },
}

export {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    UserValidation,
}
