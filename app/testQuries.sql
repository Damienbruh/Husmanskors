

--infoga spelare
INSERT INTO users (user_id, name)
VALUES (1, 'PlayerOne');
INSERT INTO users (user_id, name)
VALUES (2, 'PlayerTwo');
INSERT INTO users (user_id, name)
VALUES (3, 'PlayerThree');


-- hitta ordet hus i dictionary
SELECT * FROM dictionary WHERE word = 'hus';

--välj de 10 första orden från dictionary
SELECT * FROM dictionary ORDER BY word LIMIT 10;



--infoga ett spel i "lobby" status
INSERT INTO games (game_id, player_1, player_2, state, gamecode)
VALUES (1, 'PlayerOne', NULL, 'lobby', 'ABC123');


--infoga ett aktivt spel med två spelare
INSERT INTO games (game_id, player_1, player_2, state, gamecode)
VALUES (2, 'PlayerOne', 'PlayerTwo', 'active', 'DEF456');


--infoga ett avslutat spel
INSERT INTO games (game_id, player_1, player_2, state, gamecode)
VALUES (3, 'PlayerOne', 'PlayerTwo', 'ended', 'GHI789');
