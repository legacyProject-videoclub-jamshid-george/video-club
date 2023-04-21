// The purpose of this code is to define a React component that renders a list of saved movies and provides a delete button for each movie. The list of saved movies is fetched from the server and stored in the component state using the useState hook. The deleteMovie function is called when the delete button is clicked, which sends a DELETE request to the server to delete the movie with the specified movie_id. If there is an error, an error message is displayed.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Savedmovies() {
  const [savedMovies, setSavedMovies] = useState([]);
  let token = localStorage.getItem("token");
  const navigate = useNavigate();

  let defaultimg = "Images/posternotfound.jpg";

  async function getAllMovies() {
    // protecting Router /savedmovies;
    if (!token) {
      return navigate("/login");
    }
    let response = await axios.get("http://localhost:8000/saved-movies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSavedMovies(response.data);
  }

  useEffect(() => {
    getAllMovies();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function deleteMovie(movie_id) {
    try {
      let response = await axios.delete(`http://localhost:8000/delete-movie/${movie_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });  
      if (response.status === 200) {
        alert("Movie deleted successfully!");
        getAllMovies();
      } else {
        alert("Error deleting movie");
      }
    } catch (error) {
      console.log("Error deleting movie: ", error);
      alert("Error deleting movie");
    }
  }

  return (
    <div>
      {savedMovies.length > 0 && (
        <ul className="saved-movies">
          {savedMovies.map((savedMovie) => (
            <li key={savedMovie.id} className="saved-movie-container">
              <img
                src={savedMovie.image ? savedMovie.image : defaultimg}
                className="saved-movie-image"
                alt="poster"
              />
              <div className="saved-movie-info">
                <h2 className="saved-movie-title">{savedMovie.title}</h2>
                <p className="saved-movie-description">
                  {savedMovie.description}
                </p>

                <button
                  className="saved-movie-delete"
                  onClick={() => deleteMovie(savedMovie.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Savedmovies;
