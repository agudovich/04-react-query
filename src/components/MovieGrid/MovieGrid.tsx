import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map((m) => (
        <li key={m.id}>
          <div className={css.card} onClick={() => onSelect(m)} role="button">
            <img
              className={css.image}
              src={
                m.poster_path
                  ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                  : "https://placehold.co/500x750?text=No+Poster"
              }
              alt={m.title}
              loading="lazy"
            />
            <h2 className={css.title}>{m.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
