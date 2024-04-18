const fs = require("fs");
const initSqlJs = require("sql.js");

const tableStatements = fs.readFileSync(`${__dirname}/tables.sql`, { encoding: 'utf-8' });

const tableLoadOrder = [
  "tournaments",
  "teams",
  "players",
  "tournament_teams",
  "tournament_team_players",
  "game_types",
  "games",
  "player_game_stats",
  "award_types",
  "awards"
];

initSqlJs().then(function (SQL) {
  const db = new SQL.Database();
  db.run(tableStatements)
  
  tableLoadOrder.forEach(table => {
    const data = fs.readFileSync(`${__dirname}/data/${table}.sql`, { encoding: 'utf-8' });
    db.run(data)
  })

  fs.writeFileSync(`${__dirname}/../../public/db.sqlite`, Buffer.from(db.export()));
});