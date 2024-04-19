"use client"

import { useCallback, useEffect, useState } from "react";
import initSqlJs, { type Database } from "sql.js";

export default function useDatabase() {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    // Load sql.js and initialize the database
    initSqlJs({
      locateFile: () => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm',
    }).then(async SQL => {
      const dbData = await fetch("/db.sqlite").then(res => res.arrayBuffer());
      setDb(new SQL.Database(new Uint8Array(dbData)));
    });
  }, []);

  // Example method to execute a query
  const executeQuery = useCallback((query: string) => {
    if (!db) {
      console.error("Database not initialized!");
      return null;
    }

    try {
      const stmt = db.prepare(query);
      const rows: any[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();

      return rows;
    } catch (error) {
      console.error("Error executing query:", error);
      return null;
    }
  }, [db]);

  // Other methods to interact with the database

  return { db, executeQuery };
}
