"use client";

import React, { useState, useEffect } from "react";
import useDatabase from "../useDatabase";

export default function Home() {
  const { executeQuery } = useDatabase();
  const [tournaments, setTournaments] = useState<{ id: number, name: string }[]>([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      const query = "SELECT id, name FROM tournaments";
      const results = executeQuery(query);
      if (results) {
        setTournaments(results);
      }
    };

    fetchTournaments();
  }, [executeQuery]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">The League</h1>
      <div className="flex items-center mb-4">
        <label className="mr-2">Choose a tournament:</label>
        <select className="border rounded p-2 h-7 w-60">
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
