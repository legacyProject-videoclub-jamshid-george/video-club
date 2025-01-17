// The purpose of this code is to create a React component that allows users to search for movies and save them. The component renders a form with an input field and a submit button, which sends a GET request to the server with the query parameter. It also renders a list of movie search results if results is not empty, each with its own "Save" button that sends a PUT request to the server with the movie data and user's authorization token.

import { useState } from "react";
import axios from "axios";

function Searchresults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [savedMoviesId, setSavedMoviesId] = useState([]);

  let token = localStorage.getItem("token");

  let defaultimg = "Images/posternotfound.jpg";

  async function fetchMovies(e) {
    e.preventDefault();

    let response = await axios.get(
      `http://localhost:8000/movie?title=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //fetch saved movies from database
    let { data } = await axios.get("http://localhost:8000/saved-movies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //on first load , keep only the id field
    const moviesId = data.map((movie) => movie.id);
    //keep the state of the mapped array
    setSavedMoviesId(moviesId);

    setDataSubmitted(true);

    if (response.status === 200) {
      setResults(response.data.results);
    } else {
      setResults([]);
    }
  }

  // SAVE BUTTON
  async function saveMovie(movie) {
    //add to the object fetched from imdb api a new property for user rating
    movie["rating"] = 0; 
    try {
      let response = await axios.put(
        "http://localhost:8000/save-movie",
        movie,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.msg);

      //on save btn click , update the savedMoviesId array with the clicked movie
      setSavedMoviesId((previousSavedMoviesId) => {
        const updatedIdArray = [...previousSavedMoviesId, movie.id];
        return updatedIdArray;
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <form className='submitForm' onSubmit={fetchMovies}>
        <label htmlFor='input'>Search for a movie title:</label>
        <input
          id='input'
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className='buttonSubmit' type='submit'>
          Submit
        </button>
        {!dataSubmitted && (
          <img
            src='https://whatthefrance.org/wp-content/uploads/2021/01/Videoclub-300x120.png'
            className='logo'
            alt='logo'
          />
        )}
      </form>
      {results.length > 0 && (
        <div className='searchresults'>
          {results.map((result) => (
            <div key={result.id} className='result-container'>
              <img
                src={result.image ? result.image : defaultimg}
                className='result-image'
                alt='poster'
              />
              <div className='result-info'>
                <h2 className='result-title'>{result.title}</h2>
                <p className='result-description'>{result.description}</p>
                {savedMoviesId.includes(result.id) ? (
                  <button className='save-btn-disabled' disabled={true}>
                    save
                  </button>
                ) : (
                  <button
                    className='result-save'
                    onClick={() => saveMovie(result)}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Searchresults;
