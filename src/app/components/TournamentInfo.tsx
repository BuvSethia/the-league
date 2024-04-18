"use client";

import React, { useState, useEffect } from "react";
import useDatabase from "../../useDatabase";

function TournamentInfo({ tournamentId }: { tournamentId: number }) {
  const { executeQuery } = useDatabase();
  const [tournament, setTournament] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const fetchTournamentInfo = () => {
      const tournamentQuery = `SELECT id, name, location, start_date, end_date 
                                FROM tournaments 
                                WHERE id = ${tournamentId}`;
      const teamsQuery = `SELECT tt.placement, t.name AS team_name 
                          FROM tournament_teams tt 
                          JOIN teams t ON tt.team_id = t.id 
                          WHERE tt.tournament_id = ${tournamentId} 
                          ORDER BY tt.placement`;

      const tournamentResult = executeQuery(tournamentQuery);      
      const teamsResult = executeQuery(teamsQuery);

      if (tournamentResult && tournamentResult.length > 0) {
        setTournament(tournamentResult[0]);
      }

      if (teamsResult) {
        setTeams(teamsResult);
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
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index}>
              <td className="border border-white-800 p-2">{team.placement}</td>
              <td className="border border-white-800 p-2">{team.team_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TournamentInfo;
