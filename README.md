# create react app backend

Something to serve MySQL data as JSON for my local create react app (CRA) projects.

## configuration

Database details should be stored in a `.env` file.
An example file would contain

```
REACT_APP_DATA_HOST="localhost"
REACT_APP_DATA_USER="mysqluser"
REACT_APP_DATA_PASSWORD="mysqlpassword"
REACT_APP_DATA_DATABASE="mysqldatabase"
REACT_APP_DATA_GET_USERS="SELECT * FROM user"
REACT_APP_DATA_GET_PROJECTS="SELECT * FROM project"
REACT_APP_DATA_POST_LOGIN="SELECT id FROM user WHERE email = ? AND password = ?"
REACT_APP_COOKIE_SECRET="FDHSJDF..."
```

The regular expression is `REACT_APP_DATA_(GET|POST)_\w+`.

A `GET` request `/api/word` will lookup the value with `REACT_APP_DATA_GET_WORD` in your `.env` file.

[Use `?` for user provided data.](https://github.com/mysqljs/mysql#escaping-query-values)

Run with `npm run start:backend`. This will server from port 3001.
It's expected that your CRA is on port 3000 and you have

```json
{
  "proxy": "http://localhost:3001"
}
```

in the CRA `package.json`.
