"use client"

import { useCallback, useEffect, useState } from "react";
import { type Database } from "sql.js";

export default function useDatabase() {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    // Load sql.js and initialize the database
    while (!(window as any).initSqlJs) {}
    
    (window as any).initSqlJs({
      locateFile: () => '/the-league/sql-wasm.wasm',
    }).then(async (SQL: any) => {
      (window as any).SQL = SQL;
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
