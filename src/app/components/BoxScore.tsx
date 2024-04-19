import React from "react";

function BoxScore ({ teamName, teamStats }: { teamName: string, teamStats: any }) {
    return <div>
    <h3 className="text-xl">{teamName}</h3>
    <table className="border-collapse border border-white-800 mt-2">
      <thead>
        <tr>
          <th className="border border-white-800 p-2">Player Name</th>
          <th className="border border-white-800 p-2">PTS</th>
          <th className="border border-white-800 p-2">FGs</th>
          <th className="border border-white-800 p-2">3Ps</th>
          <th className="border border-white-800 p-2">OREB</th>
          <th className="border border-white-800 p-2">DREB</th>
          <th className="border border-white-800 p-2">REB</th>
          <th className="border border-white-800 p-2">AST</th>
          <th className="border border-white-800 p-2">STL</th>
          <th className="border border-white-800 p-2">BLK</th>
          <th className="border border-white-800 p-2">TOV</th>
        </tr>
      </thead>
      <tbody>
        {teamStats.map((player: any, index: number) => (
          <tr key={index}>
            <td className="border border-white-800 p-2">{player.player_name}</td>
            <td className="border border-white-800 p-2">{2 * (player.fgm ?? 0) + 3 * (player.threepm ?? 0)}</td>
            <td className="border border-white-800 p-2">{player.fgm ?? 0} / {player.fga ?? 0}</td>
            <td className="border border-white-800 p-2">{player.threepm ?? 0} / {player.threepa ?? 0}</td>
            <td className="border border-white-800 p-2">{player.oreb ?? 0}</td>
            <td className="border border-white-800 p-2">{player.dreb ?? 0}</td>
            <td className="border border-white-800 p-2">{player.oreb ?? 0 + player.dreb ?? 0}</td>
            <td className="border border-white-800 p-2">{player.ast ?? 0}</td>
            <td className="border border-white-800 p-2">{player.stl ?? 0}</td>
            <td className="border border-white-800 p-2">{player.blk ?? 0}</td>
            <td className="border border-white-800 p-2">{player.tov ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}

export default BoxScore;
