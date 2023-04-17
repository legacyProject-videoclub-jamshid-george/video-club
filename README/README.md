Video Club
Video Club is a web application that allows users to search for movies using keywords and save them to their account. The application uses the IMDB API to fetch movies and stores them in a database under the user's account.

Features
User authentication: Users have to register and login to use the application.
Movie search: Users can search for movies using keywords for the title.
Random movie quote: The application displays a random quote from a movie on the first page.
Movie display: After a user searches for a movie, the application displays 25 movies relevant to the user's input. Each movie is displayed with an image, title, small description, and a save button.
Movie save: The save button saves the selected movie to the user's account in the database.
Saved movies: The application has a link that navigates users to their saved movies page, where they can view the movies they have saved. Each saved movie is displayed with an image, title, and a delete button.
Movie delete: The delete button removes the selected movie from the user's account in the database.
Technologies used
ReactJS: Frontend framework
NodeJS and ExpressJS: Backend framework
MongoDB: Database for storing user data and saved movies
IMDB API: Used to fetch movie data
JWT: Tokenization of user login
Installation
Clone the repository using the command below:

git clone https://github.com/<username>/video-club.git
Install dependencies for the frontend and backend using the following command in both the client and server directories:

npm install
Create a .env file in the server directory and add the following variables:
makefile

NODE_ENV=development
PORT=<port-number>
MONGODB_URI=<mongodb-uri>
JWT_SECRET=<jwt-secret>
Start the application using the following command in the server directory:

npm run dev
Open your browser and navigate to http://localhost:<port-number> to use the application.
Contributors
Spyros Trimis
Ioannis Skardasis
License
This project is licensed under the MIT License - see the LICENSE file for details.
