export const messages = {
    userWrongId: (id: string) =>
        `Invalid input: 'userId' should be of type uuid, but got '${id}'`,
    userNotFound: (id: string) => `Not found: no user with ID ${id}`,
}
