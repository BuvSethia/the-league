"use client";

import React, { useState, useEffect } from "react";
import useDatabase from "../../useDatabase";

function TournamentInfo({ tournamentId }: { tournamentId: number }) {
  const { executeQuery } = useDatabase();
  const [tournament, setTournament] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);

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

        const [tournamentResult, teamsResult] = await Promise.all([
          executeQuery(tournamentQuery),
          executeQuery(teamsQuery)
        ]);

        if (tournamentResult && tournamentResult.length > 0) {
          setTournament(tournamentResult[0]);
        }

        if (teamsResult) {
          setTeams(teamsResult);
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{tournament.name}</h2>
      <p>
        <strong>Location:</strong> {tournament.location}
      </p>
      <p>
        <strong>Date:</strong> {tournament.start_date}
        {tournament.start_date !== tournament.end_date && ` - ${tournament.end_date}`}
      </p>
      <h3 className="text-xl font-semibold mt-4">Participating Teams</h3>
      <table className="border-collapse border border-white-800 mt-2">
        <thead>
          <tr>
            <th className="border border-white-800 p-2">Standing</th>
            <th className="border border-white-800 p-2">Team</th>
            <th className="border border-white-800 p-2">Record</th>
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
                    <br/>
                    Finals: {team.wins_finals}-{team.losses_finals}
                    </>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TournamentInfo;

