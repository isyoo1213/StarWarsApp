import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = async () => {
    setIsLoading(true);
    setError(null);
    {/* 새로운 요청을 보낼 때 이전에 설정된 error에 대한 초기화처리에 필요 
        async - try catch/ promise - cache*/}

    try{
      const response = await fetch("https://swapi.dev/api/films/");

      if(!response.ok){
        throw new Error('An Error accured!')
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
      setIsLoading(false);
    } catch(error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  let content = <p>Found no movies</p>

  if(isLoading){
    content = <p>Loading...</p>
  } else if (error){
    content = <p>{error}</p>
  } else if(movies.length === 0 || movies.length < 0) {
    content = <p>Found No Movies.</p>
  } else {
    content = <MoviesList movies={movies} />
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {isLoading && <p>Loading...</p>}
        {!isLoading && movies.length === 0 && !error && <p>Found No Movies.</p>}
        {!isLoading && error && <p>{error}</p>} */}
      </section>
    </React.Fragment>
  );
}

export default App;
