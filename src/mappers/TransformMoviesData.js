function transformResultsData(data) {
  const posterPath = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : '';

  const avgRating = Number.isInteger(data.vote_average)
    ? `${data.vote_average}.0`
    : Math.round(data.vote_average * 10) / 10;

  let userRating;

  try {
    userRating =
      data.rating || JSON.parse(localStorage.getItem('ratedMovies'))[data.id];
  } catch {
    userRating = 0;
  }

  return {
    id: data.id,
    title: data.title,
    avgRating,
    userRating,
    posterPath,
    releaseDate: data.release_date,
    overview: data.overview,
    genreId: data.genre_ids,
  };
}

function transformMoviesData(data) {
  const {
    page,
    results,
    total_pages: totalPages,
    total_results: totalResults,
  } = data;

  return {
    page,
    results: results.map(transformResultsData),
    totalPages: totalPages >= 500 ? 500 : totalPages,
    totalResults: totalResults >= 10000 ? 10000 : totalResults,
  };
}

export default transformMoviesData;
