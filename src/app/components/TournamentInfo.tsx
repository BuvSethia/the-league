"use client";

import React, { useState, useEffect } from "react";
import useDatabase from "../../useDatabase";

const SELECTED_BUTTON_CLASSES = "border-red-800";

function TournamentInfo({
  tournamentId,
  onGameSelect,
}: {
  tournamentId: number;
  onGameSelect: (gameId: number) => void;
}) {
  const { executeQuery } = useDatabase();
  const [tournament, setTournament] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournamentInfo = async () => {
      try {
        const tournamentQuery = `SELECT id, name, location, start_date, end_date 
                                  FROM tournaments 
                                  WHERE id = ${tournamentId}`;
        const teamsQuery = `SELECT 
        teams.id AS team_id,
        teams.name AS team_name,
        COUNT(CASE WHEN games.winning_team_id = teams.id AND games.game_type_id = 1 THEN 1 END) AS wins_rs,
        COUNT(CASE WHEN games.winning_team_id = teams.id AND games.game_type_id = 2 THEN 1 END) AS wins_finals,
        (COUNT(CASE WHEN ((games.team1_id = teams.id OR games.team2_id = teams.id) AND games.game_type_id = 1) THEN 1 END) 
            - COUNT(CASE WHEN games.winning_team_id = teams.id AND games.game_type_id = 1 THEN 1 END) 
            - COUNT(CASE WHEN games.winning_team_id IS NULL AND games.game_type_id = 1 THEN 1 END)) AS losses_rs,
            (COUNT(CASE WHEN ((games.team1_id = teams.id OR games.team2_id = teams.id) AND games.game_type_id = 2) THEN 1 END) 
            - COUNT(CASE WHEN games.winning_team_id = teams.id AND games.game_type_id = 2 THEN 1 END) 
            - COUNT(CASE WHEN games.winning_team_id IS NULL AND games.game_type_id = 2 THEN 1 END)) AS losses_finals
    FROM 
        teams
    JOIN 
        tournament_teams ON teams.id = tournament_teams.team_id
    JOIN 
        games ON (tournament_teams.tournament_id = games.tournament_id AND (games.team1_id = teams.id OR games.team2_id = teams.id))
    WHERE 
        (games.game_type_id = 1 OR games.game_type_id = 2)
        AND tournament_teams.tournament_id = '${tournamentId}'
    GROUP BY 
        teams.id, teams.name`;

        const gamesQuery = `
        SELECT 
    id AS game_id,
    date AS game_date,
    game_type_id,
    team1_id,
    team2_id
FROM 
    games
WHERE 
    games.tournament_id = '${tournamentId}'
ORDER BY 
    games.date;
        `;

        const [tournamentResult, teamsResult, gamesResult] = [
          executeQuery(tournamentQuery),
          executeQuery(teamsQuery),
          executeQuery(gamesQuery),
        ];

        if (tournamentResult && tournamentResult.length > 0) {
          setTournament(tournamentResult[0]);
        }

        if (teamsResult) {
          setTeams(teamsResult);
        }

        if (gamesResult) {
          setGames(gamesResult);
        }
      } catch (error) {
        console.error("Error fetching tournament info:", error);
      }
    };

    fetchTournamentInfo();
  }, [executeQuery, tournamentId]);

  if (!tournament) {
    return <div>Loading...</div>;
  }

  const handleGameClick = (buttonKey: string, gameId: number) => {
    onGameSelect(gameId);
    setSelectedButton(buttonKey);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">{tournament.name}</h2>
      <p>
        <strong>Location:</strong> {tournament.location}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(tournament.start_date).toLocaleDateString()}
        {tournament.start_date !== tournament.end_date &&
          ` - ${new Date(tournament.end_date).toLocaleDateString()}`}
      </p>

      <h3 className="text-xl font-bold mt-4 mb-1">Winner:</h3>

      <h3 className="text-xl font-bold mt-4 mb-1">Awards</h3>
      <p className="font-semibold">MVP:</p>
      <p className="font-semibold">Finals MVP:</p>
      <p className="font-semibold">Defensive Player:</p>
      <p className="font-semibold">All-tournament Team:</p>
      <ul className="list-disc">
        {[1, 2, 3, 4, 5].map((i) => (
          <li key={i} className="ml-7"></li>
        ))}
      </ul>

      <h3 className="text-xl font-bold mt-4">Teams</h3>
      <table className="border-collapse border border-white-800 mt-2">
        <thead>
          <tr>
            <th className="border border-white-800 p-2">Standing</th>
            <th className="border border-white-800 p-2">Team</th>
            <th className="border border-white-800 p-2">Record</th>
            <th className="border border-white-800 p-2">Games</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index}>
              <td className="border border-white-800 p-2">{team.placement}</td>
              <td className="border border-white-800 p-2">{team.team_name}</td>
              <td className="border border-white-800 p-2">
                Group: {team.wins_rs}-{team.losses_rs}
                {team.wins_finals + team.losses_finals > 0 ? (
                  <>
                    <br />
                    Finals: {team.wins_finals}-{team.losses_finals}
                  </>
                ) : null}
              </td>
              <td className="border border-white-800 p-2">
                <p className="mr-2 inline">Group:</p>
                {games
                  .filter(
                    (game) =>
                      game.game_type_id === 1 &&
                      (game.team1_id === team.team_id ||
                        game.team2_id === team.team_id),
                  )
                  .map((game, idx) => {
                    const buttonKey = `${team.team_id}--${game.game_id}`;
                    const styles =
                      buttonKey === selectedButton
                        ? SELECTED_BUTTON_CLASSES
                        : "";

                    return (
                      <button
                        className={`mr-2 mt-1 mb-1 pl-2 pr-2 rounded shadow:bg-white-800 border border-white-200 shadow shadow-black hover:ring-2 hover:ring-blue-500 ${styles} `}
                        key={idx}
                        onClick={() => handleGameClick(buttonKey, game.game_id)}
                      >
                        Game {idx + 1}
                      </button>
                    );
                  })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TournamentInfo;
