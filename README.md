Express JWT Authentication API

This repository contains the source code for an Express.js RESTful API with JWT (JSON Web Token) authentication. It allows users to register, login, manage favorites, and view history.

Features

User Registration: Users can register with a unique username and password.
User Authentication: Secure authentication using JWT.
Login: Users can log in to receive a JWT token for subsequent requests.
Favorites Management: Authenticated users can add and remove items from their favorites list.
History Tracking: Users' browsing history is recorded and can be accessed.
Middleware for Authentication: Middleware ensures that certain routes are only accessible to authenticated users.

Technologies Used

Express.js: A minimal and flexible Node.js web application framework.
JWT (JSON Web Tokens): Tokens are used for secure transmission of information between parties.
Passport.js: A middleware for Node.js used for authentication.
MongoDB: A NoSQL database for storing user information, favorites, and history.
dotenv: A module for loading environment variables from a .env file.
cors: Middleware for enabling Cross-Origin Resource Sharing (CORS).

Installation

Clone this repository.
Install dependencies using npm install.
Set up a MongoDB database and update the connection string in user-service.js.
Create a .env file and add the following variables:
makefile
Copy code
PORT=8080
JWT_SECRET=your_jwt_secret
Replace your_jwt_secret with a random string for JWT signing.
Run the server using npm start.

Endpoints

POST /api/user/register: Register a new user.
POST /api/user/login: Login to receive a JWT token.
GET /api/user/favourites: Get a user's favorite items.
PUT /api/user/favourites/:id: Add an item to user's favorites.
DELETE /api/user/favourites/:id: Remove an item from user's favorites.
GET /api/user/history: Get a user's browsing history.
PUT /api/user/history/:id: Add an item to user's browsing history.
DELETE /api/user/history/:id: Remove an item from user's browsing history.


Author

Yunus Emre Gumus

Acknowledgments

Thanks to the developers of Express, JWT, Passport.js, and other dependencies used in this project.
