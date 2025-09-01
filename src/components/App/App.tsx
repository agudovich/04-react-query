import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<Movie | null>(null);

  const { data, isError, isSuccess, isPending, isFetching } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  function handleSearch(nextQuery: string) {
    setQuery(nextQuery);
    setPage(1);
  }

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  // тост
  useEffect(() => {
    if (!query) return;
    if (isSuccess && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data, query]);

  return (
    <>
      <Toaster position="top-right" />

      <SearchBar onSubmit={handleSearch} />

      {query && isPending && <Loader />}
      {query && !isPending && isError && <ErrorMessage />}

      {query && !isPending && !isError && isSuccess && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          {movies.length > 0 && (
            <MovieGrid movies={movies} onSelect={setSelected} />
          )}

          {isFetching && <div className={css.updating}>Updating…</div>}
        </>
      )}

      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
