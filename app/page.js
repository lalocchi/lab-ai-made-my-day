"use client";

import { useEffect, useState } from "react";
import { POKE_API, PAGE_SIZE } from "./lib/pokeapi";
import PokemonCard from "./components/PokemonCard";
import PokemonDetail from "./components/PokemonDetail";
import Pagination from "./components/Pagination";
import styles from "./page.module.css";

export default function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch a page of Pokémon every time the page number changes.
  useEffect(() => {
    async function loadPokemon() {
      setLoading(true);
      setError(null);

      try {
        const offset = (page - 1) * PAGE_SIZE;
        const res = await fetch(`${POKE_API}?limit=${PAGE_SIZE}&offset=${offset}`);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setPokemon(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, [page]);
return (
  <div className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>Pokédex</h1>

      <p className={styles.subtitle}>
        Click on a Pokémon to see its details.
      </p>
    </header>

    {loading && (
      <p className={styles.loading}>
        Loading Pokémon…
      </p>
    )}

    {error && (
      <div className={styles.errorBox}>
        <strong>Oops! We couldn&apos;t load the Pokémon.</strong>

        <p className={styles.errorText}>
          {error}
        </p>
      </div>
    )}
      {!loading && !error && (
        <>
          <div className={styles.grid}>
            {pokemon.map((p) => (
              <PokemonCard key={p.name} pokemon={p} onSelect={setSelected} />
            ))}
          </div>

          <Pagination
            page={page}
            onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setPage((prev) => prev + 1)}
          />
        </>
      )}

      {selected && (
        <PokemonDetail pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
