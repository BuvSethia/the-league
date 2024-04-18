const fs = require("fs");
const initSqlJs = require("sql.js");

const tableStatements = fs.readFileSync(`${__dirname}/tables.sql`, { encoding: 'utf-8' });
const loadStatements = fs.readFileSync(`${__dirname}/load.sql`, { encoding: 'utf-8' });

initSqlJs().then(function (SQL) {
  const db = new SQL.Database();
  db.run(tableStatements)
  db.run(loadStatements)

  fs.writeFileSync(`${__dirname}/db.sqlite`, Buffer.from(db.export()));
});