DROP DATABASE IF EXISTS watchList_db;

CREATE DATABASE watchList_db;

CREATE TABLE watchList(
    id INT  PRIMARY KEY AUTO_INCREMENT,
    movieTitle VARCHAR(50),
    watched BOOLEAN
)