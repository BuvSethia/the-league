CREATE TABLE IF NOT EXISTS tournaments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    current_team_id INTEGER,
    FOREIGN KEY (current_team_id) REFERENCES teams (id)
);

CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    primary_color TEXT NOT NULL,
    captain_id INTEGER,
    FOREIGN KEY (captain_id) REFERENCES players (id)
);

CREATE TABLE IF NOT EXISTS tournament_teams (
    tournament_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    placement INTEGER,
    PRIMARY KEY (tournament_id, team_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
    FOREIGN KEY (team_id) REFERENCES teams (id),
    UNIQUE (tournament_id, team_id)
);

CREATE TABLE IF NOT EXISTS tournament_team_players (
    tournament_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    PRIMARY KEY (tournament_id, player_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
    FOREIGN KEY (player_id) REFERENCES players (id),
    FOREIGN KEY (team_id, tournament_id) REFERENCES tournament_teams (team_id, tournament_id),
    UNIQUE (tournament_id, player_id)
);

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY,
    tournament_id INTEGER NOT NULL,
    date DATETIME NOT NULL,
    team1_id INTEGER NOT NULL,
    team2_id INTEGER NOT NULL,
    winning_team_id INTEGER,
    game_type_id INTEGER NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
    FOREIGN KEY (team1_id) REFERENCES teams (id),
    FOREIGN KEY (team2_id) REFERENCES teams (id),
    FOREIGN KEY (winning_team_id) REFERENCES teams (id),
    FOREIGN KEY (game_type_id) REFERENCES game_types (id)
);

CREATE TABLE IF NOT EXISTS player_game_stats (
    game_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    tov INTEGER NOT NULL,
    fgm INTEGER NOT NULL,
    fga INTEGER NOT NULL,
    oreb INTEGER NOT NULL,
    dreb INTEGER NOT NULL,
    ast INTEGER NOT NULL,
    stl INTEGER NOT NULL,
    blk INTEGER NOT NULL,
    threepm INTEGER NOT NULL,
    threepa INTEGER NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games (id),
    FOREIGN KEY (team_id) REFERENCES teams (id),
    FOREIGN KEY (player_id) REFERENCES players (id),
    UNIQUE (game_id, player_id)
);

CREATE TABLE IF NOT EXISTS game_types (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS award_types (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS awards (
    id INTEGER PRIMARY KEY,
    tournament_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    award_type_id INTEGER NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
    FOREIGN KEY (player_id) REFERENCES players (id),
    FOREIGN KEY (award_type_id) REFERENCES award_types (id),
    FOREIGN KEY (tournament_id, player_id) REFERENCES tournament_team_players (tournament_id, player_id),
    UNIQUE (tournament_id, award_type_id),
    UNIQUE (tournament_id, player_id, award_type_id)
);
