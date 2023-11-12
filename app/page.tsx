"use client";

import { useEffect, useState } from "react";

import supabase from "@/configs/supabaseClient";
import type { Game } from "@/types/supabase.types";

import PageHero from "@/app/components/PageHero";
import GameList from "@/app/components/GameList";
import GameListLoading from "@/app/components/GameListLoading";
import GameListActoins from "@/app/components/GameListActoins";

export default function Home() {
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [fetchedGames, setFetchedGames] = useState<Game[]>([]);
  const [currentGames, setCurrentGames] = useState<Game[]>([]);

  async function getGames() {
    const { data: fetchedGames } = await supabase
      .from("games")
      .select("*")
      .order("released", { ascending: false });

    setFetchedGames(fetchedGames || []);
  }

  useEffect(() => {
    getGames();
  }, []);

  useEffect(() => {
    setCurrentGames(fetchedGames.filter((game) => game.played));
    setFetchLoading(false);
  }, [fetchedGames]);

  function filterBySearch(search: string) {
    if (search.length === 0) {
      setCurrentGames(fetchedGames.filter((game) => game.played));
    } else {
      setCurrentGames(
        fetchedGames.filter(
          (game) =>
            game.name.toLowerCase().includes(search.toLowerCase()) &&
            game.played
        )
      );
    }
  }

  function sortBy(sort: string) {
    console.log(sort);

    //   setCurrentGames([...currentGames].sort((a, b) => a.name.localeCompare(b.name)));
    // } else if (sort === "Release Date") {
    //   setCurrentGames([...currentGames].sort((a, b) => new Date(b.released).getTime() - new Date(a.released).getTime()));
    // }

    if (sort === "Alphabetical") {
      setCurrentGames(
        [...currentGames].sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        })
      );
    } else if (sort === "Release date") {
      setCurrentGames(
        [...currentGames].sort((a, b) => {
          if (a.released < b.released) return 1;
          if (a.released > b.released) return -1;
          return 0;
        })
      );
    }
  }

  return (
    <>
      <PageHero
        title="My top 100 recommend video games"
        srOnly="parallel universe archive || My top 100 recommend video games"
        description="I&lsquo;ve been fortunate to journey through countless virtual worlds,
        where I&lsquo;ve discovered what feels like parallel universes brimming
        with unique life experiences. Here, I present my top 100
        recommendations, each a captivating realm for you to explore."
      />
      {fetchLoading ? (
        <div className="w-full flex justify-center items-center">
          <GameListLoading />
        </div>
      ) : (
        <>
          <GameListActoins
            handleSearchInput={(searchValue) => filterBySearch(searchValue)}
            handleSortChange={(sortValue) => sortBy(sortValue)}
          />
          <GameList games={currentGames} />
        </>
      )}
    </>
  );
}
