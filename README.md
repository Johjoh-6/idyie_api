# Idyie api
This api is used to manage the idyie application.

## Installation
1. Clone the repository
2. Run `npm install`
3. Run `npm start`

## Routes
### Auth
| Route | Method | Description |  Permissions |
| --- | --- | --- | --- |
| /api/auth/login | POST | Login | All |
| /api/auth/register | POST | Register | All |
| /api/auth/logout | POST | Logout | All |
| /api/auth/flush | GET | Flush the expired token | Admin |
| /api/auth/flush_all | GET | Flush all the token | Admin |



### Users 
| Route | Method | Description |  Permissions |
| --- | --- | --- | --- |
| /api/users | GET | Get all users | Admin, Moderator |
| /api/users/:id | GET | Get a user by id  | Admin, Moderator |
| /api/users | POST | Create a user  | Admin |
| /api/users/:id | PUT | Update a user |  Admin, Moderator |
| /api/users/:id | DELETE | Delete a user | Admin |
| /api/users/me | GET | Get the user connected, with his token |Self |
| /api/users/me | PUT | Update the user connected | Self |
| /users/:id/ban | PUT | Ban a user |  Admin, Moderator |

### Categorie
| Route | Method | Description |  Permissions |
| --- | --- | --- | --- |
| /api/categorie | GET | Get all categorie | All |
| /api/categorie/:id | GET | Get a category by id  | All |
| /api/categorie | POST | Create a category  | Admin, Moderator |
| /api/categorie/:id | PUT | Update a category |  Admin, Moderator |
| /api/categorie/:id | DELETE | Delete a category | Admin, Moderator |

### Comment
| Route | Method | Description |  Permissions |
| --- | --- | --- | --- |
| /api/comment | GET | Get all comment | Admin, Moderator |
| /api/comment/:id | GET | Get a comment by id  | Admin, Moderator |
| /api/comment/tutorial/:id | GET | Get all comment of a tutorial | All |
| /api/comment | POST | Create a comment  | Admin, Moderator, Redactor, User |
| /api/comment/:id | PUT | Update a comment |  Admin, Moderator, Self |
| /api/comment/:id | DELETE | Delete a comment | Admin, Moderator, Self |

### Tutorial
| Route | Method | Description |  Permissions |
| --- | --- | --- | --- |
| /api/tutorial | GET | Get all tutorial | All |
| /api/tutorial/:id | GET | Get a tutorial by id  | All |
| /api/tutorial/:id/view | GET | Increment the view of a tutorial | All |
| /api/tutorial/category/:id_category | GET | Get all tutorial of a category | All |
| /api/tutorial | POST | Create a tutorial  | Admin, Moderator, Redactor |
| /api/tutorial/:id | PUT | Update a tutorial |  Admin, Moderator, Redactor(Self) |
| /api/tutorial/:id | DELETE | Delete a tutorial | Admin, Moderator, Redactor(Self) |

### Rating
| Route | Method | Description |  Permissions |
| --- | --- | --- | --- |
| /api/rating | GET | Get all rating | Admin, Moderator |
| /api/rating/:id | GET | Get a rating by id  | Admin, Moderator |
| /api/rating | POST | Create a rating  | Admin, Moderator, Redactor, User |
| /api/rating/:id | PUT | Update a rating | Self |
| /api/rating/:id | DELETE | Delete a rating | Admin, Moderator |











