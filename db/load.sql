id,name,start_date,end_date,location
-- Load data into the teams table
.mode csv
.import data/teams.csv teams

-- Load data into the players table
.mode csv
.import data/players.csv players

-- Load data into the tournaments table
.mode csv
.import data/tournaments.csv tournaments

-- Load data into the tournament_teams table
.mode csv
.import data/tournament_teams.csv tournament_teams

-- Load data into the tournament_team_players table
.mode csv
.import data/tournament_team_players.csv tournament_team_players

-- Load data into the game_types table
.mode csv
.import data/game_types.csv game_types

-- Load data into the games table
.mode csv
.import data/games.csv games

-- Load data into the player_game_stats table
.mode csv
.import data/player_game_stats.csv player_game_stats

-- Load data into the award_types table
.mode csv
.import data/award_types.csv award_types

-- Load data into the awards table
.mode csv
.import data/awards.csv awards
