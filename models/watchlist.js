var Sequelize = require("sequelize");

var sequelize = require("../config/connection.js");

var watchlist = sequelize.define("watchlist", {
  title: Sequelize.STRING,
  actor: Sequelize.STRING,
});

watchlist.sync();

module.exports = watchlist;

