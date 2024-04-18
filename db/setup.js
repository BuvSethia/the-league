const fs = require("fs");
const initSqlJs = require("./sql-wasm.js");

const dbFile = fs.readFileSync(`${__dirname}/db.sqlite`);
const tableStatements = fs.readFileSync(`${__dirname}/tables.sql`);

initSqlJs().then(function (SQL) {
  const db = new SQL.Database(dbFile);
  db.run(tableStatements)
});