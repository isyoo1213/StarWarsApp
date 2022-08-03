import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchMoviesHandler = useCallback( async () => {
    setIsLoading(true);
    setError(null);
    {/* 새로운 요청을 보낼 때 이전에 설정된 error에 대한 초기화처리에 필요 
        async - try catch/ promise - cache*/}

    try{
      const response = await fetch("https://starwarsmovieapp-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json");

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
  }, []);
  {/* state의 set함수는 리액트 자체적으로 변하지 않는 함수로 인식하므로 의존성에 추가할 필요 없음
      + 외부에서 사용하는 변수가 없으므로 의존성 추가할 필요 없음 */}

  useEffect(()=> {
    fetchMoviesHandler();
  }, [fetchMoviesHandler])
  {/* effect를 핸들러보다 먼저 호출할 시 hoisting 문제?로 핸들러가 데이터를 파싱하기 전에 핸들러 함수를 호출하므로 오류발생 */}

  const addMovieHandler = (movie) => {
    console.log(movie);
  }

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
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
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
