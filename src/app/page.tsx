"use client";

import React, { useState, useEffect } from "react";
import useDatabase from "../useDatabase";
import TournamentInfo from "./components/TournamentInfo";
import GameInfo from "./components/GameInfo";

export default function Home() {
  const { executeQuery } = useDatabase();
  const [tournaments, setTournaments] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedTournament, setSelectedTournament] = useState<number | null>(
    null,
  );
  const [gameToDisplay, setGameToDisplay] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const fetchTournaments = async () => {
      const query = "SELECT id, name FROM tournaments ORDER BY start_date DESC";
      const results = await executeQuery(query);
      if (results) {
        setTournaments(results);
        // Set the most recent tournament as the default selected tournament
        if (results.length > 0) {
          setSelectedTournament(results[0].id);
        }
      }
    };

    fetchTournaments();
  }, [executeQuery]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTournament(Number(event.target.value));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">The League</h1>
      <div className="flex items-center mb-4">
        <label className="mr-2">Choose a tournament:</label>
        <select
          className="border border-white bg-transparent text-white rounded p-2 h-10 w-60"
          value={selectedTournament || ""}
          onChange={handleSelectChange}
        >
          <option value="" disabled hidden>
            {selectedTournament
              ? "Select a tournament"
              : "Loading tournaments..."}
          </option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name}
            </option>
          ))}
        </select>
      </div>
      {selectedTournament && (
        <TournamentInfo tournamentId={selectedTournament} onGameSelect={setGameToDisplay} />
      )}

      {gameToDisplay && (
        <>          
          <GameInfo gameId={gameToDisplay} />
        </>
      )}
    </div>
  );
}
