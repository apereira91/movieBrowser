DROP DATABASE IF EXISTS watchList_db;

CREATE DATABASE watchList_db;

CREATE TABLE userId(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    userEmail VARCHAR(25) 
)

CREATE TABLE watchList(
    id INT  PRIMARY KEY AUTO_INCREMENT,
    movieTitle VARCHAR(50),
    watched BOOLEAN
    watched BOOLEAN,
    FOREIGN KEY(user_id) REFERENCES (userId)
) 