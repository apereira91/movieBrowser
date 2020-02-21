let Sequelize = require("sequelize");

let sequelize = require("../config/connection.js");

let watchlist = sequelize.define("watchlist", {
    title: Sequelize.STRING,
    actor: Sequelize.STRING,
});

watchlist.sync();

module.exports = watchlist; 

