# Idyie api

This api is used to manage the idyie application.

## Installation

1. Clone the repository
2. Run `npm install`

## Configuration

1. Create a `.env` file at the root of the project
2. Copy the content of `.env.example` in `.env`

```bash
cp .env.example .env
```

3. Fill the `.env` file with your configuration

## Run

1. Run `npm start`

## Routes

The list of routes is available in this API.

| Role      |
| --------- |
| Admin     |
| Moderator |
| Redactor  |
| User      |
| Self      |
| All       |

_All_ means that the route is accessible to everyone.
_Self_ means that the route is accessible only to creator.

> All the permissions return different error messages if the user is not allowed to access the route.

#### Unauthenticated Error

Response :

- 401

```json
{
  "error": "Unauthorized"
}
```

> This error is returned when the user is not authenticated or Token is not valid

```json
{
  "error": "Token expired"
}
```

> This error is returned when the token is expired

### Auth

| Route               | Method | Description             | Permissions |
| ------------------- | ------ | ----------------------- | ----------- |
| /api/auth/login     | POST   | Login                   | All         |
| /api/auth/register  | POST   | Register                | All         |
| /api/auth/logout    | POST   | Logout                  | All         |
| /api/auth/flush     | GET    | Flush the expired token | Admin       |
| /api/auth/flush_all | GET    | Flush all the token     | Admin       |

#### Login

Body :

```json
{
  "email": "email",
  "password": "password"
}
```

Response :

- 200

```json
{
  "message": "Loggin succesful"
}
```

> Set the token in the cookie

- 400

```json
{
  "error": "Bad request"
}
```

> Return the error message

#### Register :

Body :

```json
{
  "email": "email",
  "password": "password",
  "username": "username"
}
```

Response :

- 201

```json
{
  "message": "User created"
}
```

> Set the token in the cookie

- 400

```json
{
  "error": "Bad request"
}
```

> Return the error message

#### Logout :

Response :

- 200

```json
{
  "message": "Logout succesful"
}
```

> Delete the token in the cookie

- 400

```json
{
  "error": "Bad request"
}
```

> Return the error message

- 401

```json
{
  "error": "Unauthorized"
}
```

#### Flush :

Response :

- 200

```json
{
  "message": "Flushed"
}
```

> Delete the expired token

- 400

```json
{
  "error": "Bad request"
}
```

> Return the error message

- 401

```json
{
  "error": "Fail to flush"
}
```

#### Flush all :

Response :

- 200

```json
{
  "message": "Flushed"
}
```

> Delete all the token

- 400

```json
{
  "error": "Bad request"
}
```

> Return the error message

- 401

```json
{
  "error": "Fail to flush"
}
```

### Users

| Route          | Method | Description                            | Permissions      |
| -------------- | ------ | -------------------------------------- | ---------------- |
| /api/users     | GET    | Get all users                          | Admin, Moderator |
| /api/users/:id | GET    | Get a user by id                       | Admin, Moderator |
| /api/users     | POST   | Create a user                          | Admin            |
| /api/users/:id | PUT    | Update a user                          | Admin, Moderator |
| /api/users/:id | DELETE | Delete a user                          | Admin            |
| /api/users/me  | GET    | Get the user connected, with his token | Self             |
| /api/users/me  | PUT    | Update the user connected              | Self             |
| /users/:id/ban | PUT    | Ban a user                             | Admin, Moderator |

#### Get all users

Response :

- 200

```json
    {
       [
        {
            "id": 1,
            "username": "string",
            "f_name": "string",
            "l_name": "string",
            "email": "string",
            "avatar": null | "string",
            "role": "string",
            "ban": "boolean",
            "created_at": "string",
            "updated_at": "string"
  },
       ]
    }
```

> Return all users

#### Get a user by id

Parameters:

- id: number
  Response :
- 200

```json
        {
            "id": 1,
            "username": "string",
            "f_name": "string",
            "l_name": "string",
            "email": "string",
            "avatar": null | "string",
            "role": "string",
            "ban": "boolean",
            "created_at": "string",
            "updated_at": "string"
  }
```

> Return the user

- 404

```json
{
  "error": "User not found"
}
```

#### Get the user connected

Response :

- 200

```json
        {
       [
        {
            "id": 1,
            "username": "string",
            "f_name": "string",
            "l_name": "string",
            "email": "string",
            "avatar": null | "string",
  },
       ]
    }
```

> Return the user connected

#### Create a user

Body:

```json
{
    "username": "string",
    "f_name": "string",
    "l_name": "string",
    "email": "string",
    "password": "string",
    "avatar": null | "string",
}
```

Response :

- 201

```json
{
    "id": 1,
    "username": "string",
    "f_name": "string",
    "l_name": "string",
    "email": "string",
    "password": "string",
    "avatar": null | "string",
}
```

> Return the user created

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```

> Return the error message

#### Update a user

Parameters:

- id: number
  Body:

```json
{
    "username": "string",
    "f_name": "string",
    "l_name": "string",
    "email": "string",
    "password": "string",
    "avatar": null | "string",
    "role": "string",
    "ban": "boolean",
}
```

Response :

- 200

```json
{
    "id": 1,
    "username": "string",
    "f_name": "string",
    "l_name": "string",
    "email": "string",
    "password": "string",
    "avatar": null | "string",
    "role": "string",
    "ban": "boolean",
}
```

> Return the user updated

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```

> Return the error message

- 404

```json
{
  "error": "User not found"
}
```

#### Update the user connected

Body:

```json
{
    "username": "string",
    "f_name": "string",
    "l_name": "string",
    "email": "string",
    "password": "string",
    "avatar": null | "string",
}
```

Response :

- 200

```json
{
    "id": 1,
    "username": "string",
    "f_name": "string",
    "l_name": "string",
    "email": "string",
    "password": "string",
    "avatar": null | "string",
}
```

> Return the user updated

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```

> Return the error message

#### Delete a user

Parameters:

- id: number
  Response :
- 204

```json
{
  "message": "User deleted"
}
```

> Return the message

- 404

```json
{
  "error": "User not found"
}
```

#### Ban a user

Parameters:

- id: number
  Response :
- 200

```json
{
  "message": "User banned"
}
```

- 404

```json
{
  "error": "User not found"
}
```

### Categorie

| Route              | Method | Description          | Permissions      |
| ------------------ | ------ | -------------------- | ---------------- |
| /api/categorie     | GET    | Get all categorie    | All              |
| /api/categorie/:id | GET    | Get a category by id | All              |
| /api/categorie     | POST   | Create a category    | Admin, Moderator |
| /api/categorie/:id | PUT    | Update a category    | Admin, Moderator |
| /api/categorie/:id | DELETE | Delete a category    | Admin, Moderator |

#### Get all categories

Response :

- 200

```json
{
    [
        {
            "id": 1,
            "name": "string",
            "created_at": "string",
            "updated_at": "string"
        },
    ]
}
```

> Return all categories

#### Get a category by id

Parameters:

- id: number
  Response :
- 200

```json
{
  "id": 1,
  "name": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

- 404

```json
{
  "error": "Category not found"
}
```

#### Create a category

Body:

```json
{
    "name": "string",
    "parent": null | "number"
}
```

Response :

- 201

```json
{
    "id": 1,
    "name": "string",
    "id_category_parent": null | "number",
}
```

> Return the category created

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```

#### Update a category

Parameters:

- id: number
  Body:

```json
{
    "name": "string",
    "parent": null | "number"
}
```

Response :

- 200

```json
{
    "id": 1,
    "name": "string",
    "id_category_parent": null | "number",
}
```

> Return the category updated

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```

#### Delete a category

Parameters:

- id: number
  Response :
- 204

```json
{
  "message": "Category deleted"
}
```

- 404

```json
{
  "error": "Category not found"
}
```

### Comment

| Route                     | Method | Description                   | Permissions                      |
| ------------------------- | ------ | ----------------------------- | -------------------------------- |
| /api/comment              | GET    | Get all comment               | Admin, Moderator                 |
| /api/comment/:id          | GET    | Get a comment by id           | Admin, Moderator                 |
| /api/comment/tutorial/:id | GET    | Get all comment of a tutorial | All                              |
| /api/comment              | POST   | Create a comment              | Admin, Moderator, Redactor, User |
| /api/comment/:id          | PUT    | Update a comment              | Admin, Moderator, Self           |
| /api/comment/:id          | DELETE | Delete a comment              | Admin, Moderator, Self           |

#### Get all comments

Response :

- 200

```json
{
    [
        {
            "id": 1,
            "content": "string",
            "tutorial": {
                "id": 1,
                "title": "string"
            },
            "user": {
                "id": 1,
                "username": "string",
                "avatar": null | "string"
            },
            "date": "string"
        },
    ]
}
```

> Return all comments

#### Get a comment by id

Parameters:

- id: number
  Response :
- 200

```json
{
    "id": 1,
    "content": "string",
    "tutorial": {
        "id": 1,
        "title": "string"
    },
    "user": {
        "id": 1,
        "username": "string",
        "avatar": null | "string"
    },
    "date": "string"
}
```

- 404

```json
{
  "error": "Comment not found"
}
```

#### Get all comments of a tutorial

Parameters:

- id: number
  Response :
- 200

```json
{
    [
        {
            "id": 1,
            "content": "string",
            "tutorial": {
                "id": 1,
                "title": "string"
            },
            "user": {
                "id": 1,
                "username": "string",
                "avatar": null | "string"
            },
            "date": "string",
            "res": [
                 {
                      "id": 1,
            "content": "string",
            "tutorial": {
                "id": 1,
                "title": "string"
            },
            "user": {
                "id": 1,
                "username": "string",
                "avatar": null | "string"
            },
            "date": "string",
            "res": []
                 }
            ]
        },
    ]
}
```

> Return all comments of a tutorial. The field res is an array of comments that are a response to the comment

- 404

```json
{
  "error": "Comment of this tutorial not found"
}
```

#### Create a comment

Body:

```json
{
    "content": "string",
    "id_tutorial": "number",
    "id_comment_parent": null | "number"
}
```

Response :

- 201

```json
{
  "id": 1,
  "content": "string",
  "id_tutorial": 1,
  "id_user": 1,
  "created_at": "string"
}
```

> Return the comment created

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```

#### Update a comment

Parameters:

- id: number
  Body:

```json
{
    "content": "string",
    "id_comment_parent": null | "number"
}
```

Response :

- 200

```json
{
    "id": 1,
    "content": "string",
    "id_tutorial": 1,
    "user": {
        "id": 1,
        "username": "string",
        "avatar": null | "string"
    },
    "date": "string"
}
```

> Return the comment updated

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```

#### Delete a comment

Parameters:

- id: number
  Response :
- 204

```json
{
  "message": "Comment deleted"
}
```

- 404

```json
{
  "error": "Comment not found"
}
```

### Tutorial

| Route                               | Method | Description                      | Permissions                      |
| ----------------------------------- | ------ | -------------------------------- | -------------------------------- |
| /api/tutorial                       | GET    | Get all tutorial                 | All                              |
| /api/tutorial/:id                   | GET    | Get a tutorial by id             | All                              |
| /api/tutorial/:id/view              | GET    | Increment the view of a tutorial | All                              |
| /api/tutorial/category/:id_category | GET    | Get all tutorial of a category   | All                              |
| /api/tutorial/user/:id_user         | GET    | Get all tutorial of a user       | Admin, Moderator, Redactor                              |
| /api/tutorial                       | POST   | Create a tutorial                | Admin, Moderator, Redactor       |
| /api/tutorial/:id                   | PUT    | Update a tutorial                | Admin, Moderator, Redactor(Self) |
| /api/tutorial/:id                   | DELETE | Delete a tutorial                | Admin, Moderator, Redactor(Self) |

#### Get all tutorials

Response :

- 200

```json
{
    [
        {
            "id": 1,
            "title": "string",
            "content": "string",
            "category": {
                "id": 1,
                "name": "string"
            },
            "user": {
                "id": 1,
                "username": "string",
                "avatar": null | "string"
            },
            "date": "string",
            "view_count": 1,
            "avg_rating": 1,
            "durate": 1,
            "created_at": "string",
        },
    ]
}
```

> Return all tutorials

#### Get a tutorial by id

Parameters:

- id: number
  Response :
- 200

```json
{
    "id": 1,
    "title": "string",
    "content": "string",
    "category": {
        "id": 1,
        "name": "string"
    },
    "user": {
        "id": 1,
        "username": "string",
        "avatar": null | "string"
    },
    "date": "string",
    "view_count": 1,
    "avg_rating": 1,
    "durate": 1,
    "created_at": "string",
}
```

> Return a tutorial by id

- 404

```json
{
  "error": "Tutorial not found"
}
```

#### Increment the view of a tutorial

Parameters:

- id: number
  Response :
- 200

```json
{
  "message": "View incremented"
}
```

> Add 1 to the view_count of a tutorial

- 404

```json
{
  "error": "Tutorial not found"
}
```

#### Get all tutorials of a category

Parameters:

- id_category: number
  Response :
- 200

```json
{
    [
        {
            "id": 1,
            "title": "string",
            "content": "string",
            "category": {
                "id": 1,
                "name": "string"
            },
            "user": {
                "id": 1,
                "username": "string",
                "avatar": null | "string"
            },
            "date": "string",
            "view_count": 1,
            "avg_rating": 1,
            "durate": 1,
            "created_at": "string",
        },
    ]
}
```

> Return all tutorials of a category by id or an empty array if the category doesn't exist

#### Get all tutorials of a user
Parameters:
- id_user: number
Response :
- 200

```json
{
    [
        {
            "id": 1,
            "title": "string",
            "content": "string",
            "category": {
                "id": 1,
                "name": "string"
            },
            "user": {
                "id": 1,
                "username": "string",
                "avatar": null | "string"
            },
            "date": "string",
            "view_count": 1,
            "avg_rating": 1,
            "durate": 1,
            "created_at": "string",
        },
    ]
}
```
> Return all tutorials of a user by id or an empty array if the user doesn't exist

#### Create a tutorial

Body:

```json
{
  "title": "string",
  "content": "string",
  "id_category": 1,
  "durate": 1
}
```

Response :

- 201

```json
{
  "id": 1,
  "title": "string",
  "content": "string",
  "id_category": 1,
  "durate": 1,
  "date": "string",
  "view_count": 1,
  "avg_rating": 1,
  "created_at": "string"
}
```

> Return the tutorial created

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```

#### Update a tutorial

Parameters:

- id: number
  Body:

```json
{
  "title": "string",
  "content": "string",
  "id_category": 1,
  "durate": 1
}
```

Response :

- 200

```json
{
  "id": 1,
  "title": "string",
  "content": "string",
  "id_category": 1,
  "durate": 1,
  "date": "string",
  "view_count": 1,
  "avg_rating": 1,
  "durate": 1,
  "created_at": "string",
  "updated_at": "string"
}
```

> Return the tutorial updated

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```

#### Delete a tutorial

Parameters:

- id: number
  Response :
- 204

```json
{
  "message": "Tutorial deleted"
}
```

- 404

```json
{
  "error": "Tutorial not found"
}
```

### Rating

| Route           | Method | Description        | Permissions                      |
| --------------- | ------ | ------------------ | -------------------------------- |
| /api/rating     | GET    | Get all rating     | Admin, Moderator                 |
| /api/rating/:id | GET    | Get a rating by id | Admin, Moderator                 |
| /api/rating     | POST   | Create a rating    | Admin, Moderator, Redactor, User |
| /api/rating/:id | PUT    | Update a rating    | Self                             |
| /api/rating/:id | DELETE | Delete a rating    | Admin, Moderator                 |

#### Get all ratings

Response :

- 200

```json
{
    [
        {
            "id": 1,
            "user":{
                "id": 1,
                "username": "string",
                "avatar": null | "string"
            },
            "tutorial": {
                "id": 1,
                "title": "string",
                "created_at": "string",
            },
            "rating_value": 1,
            "created_at": "string",
            "updated_at": "string",
            },
    ]
}
```

> Return all ratings

#### Get a rating by id

Parameters:

- id: number
  Response :
- 200

```json
{
    "id": 1,
    "user":{
        "id": 1,
        "username": "string",
        "avatar": null | "string"
    },
    "tutorial": {
        "id": 1,
        "title": "string",
        "created_at": "string",
    },
    "rating_value": 1,
    "created_at": "string",
    "updated_at": "string",
}
```

- 404

```json
{
  "message": "Rating not found"
}
```

#### Create a rating

Body:

```json
{
  "id_tutorial": 1,
  "rating_value": 1
}
```

Response :

- 201

```json
{
  "id": 1,
  "id_user": 1,
  "id_tutorial": 1,
  "rating_value": 1,
  "created_at": "string"
}
```

> Return the rating created

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```

#### Update a rating

Parameters:

- id: number
Body:

```json
{
  "rating_value": 1
}
```

Response :

- 200

```json
{
  "id": 1,
  "id_user": 1,
  "id_tutorial": 1,
  "rating_value": 1,
  "created_at": "string",
  "updated_at": "string"
}
```

> Return the rating updated

- 400

```json
{
  "error": "Bad Request",
  "message": "string"
}
```
