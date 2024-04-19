import React, { useState, useEffect } from "react";
import useDatabase from "../../useDatabase";

function GameInfo({ gameId }: { gameId: number }) {
  const { executeQuery } = useDatabase();
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    const fetchGameInfo = () => {
      const query = `SELECT g.team1_id, t1.name AS team1_name, 
                            g.team2_id, t2.name AS team2_name, 
                            g.date, g.game_type_id, 
                            gt.name AS game_type, g.winning_team_id
                     FROM games g
                     JOIN teams t1 ON g.team1_id = t1.id
                     JOIN teams t2 ON g.team2_id = t2.id
                     JOIN game_types gt ON g.game_type_id = gt.id
                     WHERE g.id = ${gameId}`;

      const result = executeQuery(query);
      if (result && result.length > 0) {
        setGame(result[0]);
      }
    };

    fetchGameInfo();
  }, [executeQuery, gameId]);

  if (!game) {
    return <div>Loading...</div>;
  }

  const winner = game.winning_team_id && (game.winning_team_id === game.team1_id ? game.team1_name : game.team2_name);

  return (
    <div className="container mx-auto p-4">
      <h3 className="mt-3 text-2xl font-bold">{game.team1_name} vs {game.team2_name}</h3>
      <p><strong>Date:</strong> {new Date(game.date).toLocaleDateString()}</p>
      <p><strong>Game Type:</strong> {game.game_type}</p>
      <h3 className="mt-3 text-xl font-bold">Winner: {winner}</h3>
    </div>
  );
}

export default GameInfo;
