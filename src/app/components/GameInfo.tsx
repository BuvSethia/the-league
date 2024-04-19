import React, { useState, useEffect } from "react";
import useDatabase from "../../useDatabase";
import BoxScore from "./BoxScore";

export function GameInfo({ gameId }: { gameId: number; }) {
    const { executeQuery } = useDatabase();
    const [game, setGame] = useState<any>(null);
    const [team1Stats, setTeam1Stats] = useState<any[]>([]);
    const [team2Stats, setTeam2Stats] = useState<any[]>([]);

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
                fetchTeamStats(result[0].team1_id, 1);
                fetchTeamStats(result[0].team2_id, 2);
            }
        };

        const fetchTeamStats = (teamId: number, teamNumber: number) => {
            const statsQuery = `
        SELECT pgs.*, p.name AS player_name
        FROM tournament_team_players ttp
        JOIN players p ON ttp.player_id = p.id
        LEFT JOIN player_game_stats pgs ON pgs.player_id = ttp.player_id AND pgs.game_id = '${gameId}'
        WHERE ttp.tournament_id = (SELECT tournament_id FROM games WHERE id = '${gameId}')
        AND ttp.team_id = '${teamId}'
        ORDER BY p.id`;

            const statsResult = executeQuery(statsQuery);
            if (statsResult) {
                if (teamNumber === 1) {
                    setTeam1Stats(statsResult);
                } else {
                    setTeam2Stats(statsResult);
                }
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

            <h3 className="mt-6 text-2xl">Box Score</h3>
            <div className="mt-4">
                <div className="pb-3">
                <BoxScore teamName={game.team1_name} teamStats={team1Stats} />
                </div>
                <BoxScore teamName={game.team2_name} teamStats={team2Stats} />
            </div>
        </div>
    );
}

export default GameInfo;
