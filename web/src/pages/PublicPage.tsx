import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DetailOverlay from "../components/DetailOverlay";
import MovieCardList from "../components/MovieCardList";
import YearRangeFilter from "../components/YearRangeFilter";
import { authService } from "../services/authService";
import type { PublicMovie } from "../types/auth";
import { EMPTY_YEAR_RANGE, isYearRangeActive, matchesYearRange, type YearRange } from "../utils/yearFilter";

export default function PublicPage() {
  const [movies, setMovies] = useState<PublicMovie[]>([]);
  const [yearRange, setYearRange] = useState<YearRange>(EMPTY_YEAR_RANGE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<PublicMovie | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const movieCardRefs = useRef(new Map<number, HTMLElement>());

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const ranking = await authService.getPublicRanking();
        setMovies(ranking);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Chargement impossible");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRanking();
  }, []);

  const handleOpenOverlay = (movie: PublicMovie) => {
    setSelectedMovie(movie);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedMovie(null);
  };

  const filteredMovies = movies.filter((movie) => matchesYearRange(movie.releaseDate, yearRange));

  return (
    <main className="page">
      <header className="pageHeader">
        <div className="headerTitleWrap">
          <h1>Classement Public</h1>
          <p>Version lecture seule du classement</p>
        </div>
      </header>

      {!isLoading && !error && movies.length > 0 ? (
        <YearRangeFilter range={yearRange} onChange={setYearRange} />
      ) : null}

      {isLoading ? <p className="state">Chargement...</p> : null}
      {error ? <p className="state error">{error}</p> : null}

      {!isLoading && !error && filteredMovies.length > 0 ? (
        <MovieCardList
          movies={filteredMovies}
          isDragDisabled
          hideDragHandle
          useSequentialRanks={isYearRangeActive(yearRange)}
          highlightMovieId={null}
          dropTargetMovieId={null}
          onOpenMovie={handleOpenOverlay}
          movieCardRefs={movieCardRefs}
        />
      ) : null}

      {!isLoading && !error && movies.length === 0 ? <p className="state">Aucun film disponible.</p> : null}

      {!isLoading && !error && movies.length > 0 && filteredMovies.length === 0 ? (
        <p className="state">Aucun film sorti durant cette periode.</p>
      ) : null}

      <DetailOverlay
        movie={selectedMovie}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
        maxRank={movies.length || 1}
        isReadOnly
      />

      <p className="state">
        Acces admin: <Link to="/login">/login</Link> · Demo: <Link to="/demo">/demo</Link>
      </p>
    </main>
  );
}
