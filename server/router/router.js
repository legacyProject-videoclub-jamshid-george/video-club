const express = require("express");
const axios = require("axios");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, Quote } = require("../model/model");
const verifyToken = require("../Middleware/auth");

let saltRounds = Number(process.env.SALTY_ROUNDS);

// The purpose of this code is to provide a route for user signup and handle the logic associated with it. It checks if the username already exists, hashes the password using bcrypt, creates a new user in the database, and sends appropriate responses depending on the outcome.
router.post("/signup", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      return res.send({ msg: "Both username and password are required" });
    }
    let userFound = await User.findOne({ username });
    if (userFound) {
      return res.send({ msg: "username already exists" });
    } else {
      let hashedPassword = await bcrypt.hash(password, saltRounds);

      let newUser = await User.create({
        username,
        password: hashedPassword,
      });
      return res.send({ msg: "Registered successfully. Welcome!", newUser });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Cannot register. Please try again later.", error });
  }
});

// The purpose of this code is to provide a secure way for users to log in to an application. It checks if the username and password provided in the request are valid, and if they are, it generates a JWT that can be used for authentication.
router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      return res.send({ msg: "Both username and password are required" });
    }
    let userFound = await User.findOne({ username });
    if (!userFound) {
      return res.send({ msg: "Invalid username" });
    } else {
      let validatePassword = await bcrypt.compare(password, userFound.password);
      if (!validatePassword) {
        return res.send({ msg: "Incorrect password" });
      }
      let token = jwt.sign(
        { userId: userFound._id, username: userFound.username },
        process.env.TOKEN_PRIVATE_KEY
      );
      return res.send(token);
    }
  } catch (error) {
    res.status(500).send({ msg: "Cannot login, try later", error });
  }
});

// This code defines a GET route for the endpoint "/movie". The route is protected by the middleware function "verifyToken", which ensures that the user is authenticated before accessing the route. When a GET request is made to this endpoint, the code extracts the "title" query parameter from the request object and uses it to make a GET request to the IMDB API to search for movies. The response from the API is stored in the "movieData" variable and sent back to the client as a JSON object using the "res.json()" method. If an error occurs during the API request, the code logs the error to the console and sends a 500 status code with the message "Server Error" to the client.
router.get("/movie", verifyToken, async (req, res) => {
  try {
    const title = req.query.title;
    const response = await axios.get(
      `https://imdb-api.com/en/API/SearchMovie/${process.env.IMDB_API_KEY}/${title}`
    );
    const movieData = response.data;

    res.json(movieData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// The purpose of this code is to define a route that allows a user to add a movie as a favorite in their profile. The code ensures that the user is authenticated before allowing them to add the movie, and then updates the user's document in the database with the new movie object.
router.put("/save-movie", verifyToken, async (req, res) => {
  try {
    let { id, title, description, image } = req.body;
    let newMovie = {
      id,
      title,
      description,
      image,
    };
    let userid = req.user.userId;

    await User.findOneAndUpdate(
      { _id: userid },
      { $addToSet: { favoriteMovies: newMovie } }
    );
    return res.send({ msg: "Your movie is saved successfully!", newMovie });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// This code defines a GET route /saved-movies on a router object. When a GET request is made to this route, the code tries to find the user ID from the request object and uses it to find the user in the database using User.findById(). It then retrieves the user's favorite movies from the favoriteMovies array and sends them back as a JSON response using res.json().
router.get("/saved-movies", verifyToken, async (req, res) => {
  try {
    let userid = req.user.userId;
    let user = await User.findById(userid);
    let allsavedmovies = user.favoriteMovies;
    res.json(allsavedmovies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// The purpose of this code is to allow users to delete a movie from their list of favorite movies.
router.delete("/delete-movie/:id", verifyToken, async (req, res) => {
  try {
    let movieid = req.params.id;
    let userid = req.user.userId;

    let user = await User.findById(userid);
    let allsavedmovies = user.favoriteMovies;
    for (let i = 0; i < allsavedmovies.length; i++) {
      if (movieid === allsavedmovies[i].id) {
        await User.findOneAndUpdate(
          { _id: userid },
          { $pull: { favoriteMovies: allsavedmovies[i] } }
        );
      }
    }
    res.send("Movie deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// The purpose of this code is to generate a random quote from the database and send it as the response to the client when a GET request is made to the /randomquote route.
router.get("/randomquote", async (req, res) => {
  try {
    const allquotes = await Quote.find();
    const randomquote = allquotes[Math.floor(Math.random() * allquotes.length)];
    res.send(randomquote);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
