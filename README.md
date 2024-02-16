# Simple CRUD API

## How to run?

1. Clone the repo:

```bash
git clone https://github.com/lazy-goose/simple-crud-api.git
```

2. Go to the repo folder:

```bash
cd simple-crud-api
```

3. Install npm dependencies:

```bash
npm install
```

4. Run application using one of the following scripts:

```bash
npm run start:prod
```
or
```bash
npm run start:multi
```

### What about port?

By default, the application runs on port `4000`.

If you want to change the port, you can create a `.env` file in the project root with the desired port.
Example file for port `8000`:

```
# .env file
PORT=8000
```

Be careful. Typically the `.env` file is not included in the public repository.

## API endpoints

`{userId}` is `crypto.v4()` string. For example `aa073d5b-f395-46fd-a161-e375cfaf8199`

User has the following schema:

  ```
  Required<{
      id: string crypto.v4,
      username: string,
      age: number Int,
      hobbies: string[],
  }>
  ```

-   DELETE /api/users/{userId}

    Delete specific user by {userId}

-   GET /api/users/{userId}

    Return specific user by {userId}

-   GET /api/users

    Return array of all users

-   POST /api/users

    Create new user with randomly specified {userId}

    Accepts a body satisfying the following schema:

  ```
  Required<{
      username: string,
      age: number Int,
      hobbies: string[]
  }>
  ```

-   PUT /api/users/{userId}

    Update specific user

    Accepts a body satisfying the following schema:

  ```
  Optional<{
      username: string,
      age: number Int,
      hobbies: string[]
  }>
  ```

## How to test

Run command in terminal:
```bash
npm run test:1 && npm run test:2 && npm run test:3
```

If you want to manually test the application use the following link:

`http://127.0.0.1/8000/api/users`

As a personal recommendation, use the `Postman` app.
