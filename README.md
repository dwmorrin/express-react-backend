# create react app backend

Something to serve MySQL data as JSON for my local create react app (CRA) projects.

## configuration

Database details should be stored in a `.env` file.
An example file would contain

```
# general server stuff
REACT_APP_COOKIE_SECRET="FDHSJDF..."

# database credentials
REACT_APP_DATA_HOST="localhost"
REACT_APP_DATA_USER="mysqluser"
REACT_APP_DATA_PASSWORD="mysqlpassword"
REACT_APP_DATA_DATABASE="mysqldatabase"

# GET all users from /api/users
REACT_APP_DATA_GET_USERS="SELECT * FROM user"

# GET one user from /api/users/1
REACT_APP_DATA_GET_USERS_BY_ID="${REACT_APP_DATA_GET_USERS} WHERE id = ?"

# POST
REACT_APP_DATA_POST_LOGIN="SELECT id FROM user WHERE email = ? AND password = ?"
```

The regular expression for API endpoints is
`REACT_APP_DATA_(GET|POST)_\w[^_]+(_BY_ID)?`.

A `GET` request `/api/word` will lookup the value for
`REACT_APP_DATA_GET_WORD` in your `.env` file.

An optional `id` in `/api/word/id` will lookup the value for
`REACT_APP_DATA_GET_WORD_BY_ID`.

`id` will be passed to the
first `?` in the query.

[Use `?` for user provided data.](https://github.com/mysqljs/mysql#escaping-query-values)

Run with `npm run start:backend`. This will server from port 3001.
It's expected that your CRA is on port 3000 and you have

```json
{
  "proxy": "http://localhost:3001"
}
```

in the CRA `package.json`.
