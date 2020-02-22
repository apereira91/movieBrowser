USE watchList_db;

INSERT INTO Genres (name, userid, createdAt, updatedAt)
VALUES ("Gladiator", 1, curdate(), curdate()), ("Casino", 1, curdate(), curdate()), ("Goodfellas", 1, curdate(), curdate());

SELECT * FROM watchList_db.Genres;