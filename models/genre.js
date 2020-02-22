module.exports = function (sequelize, DataTypes) { 
  var Genre = sequelize.define("Genre", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // The genreid comes from tmdb 
    genreid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
    // need to call sequelize.synch but only for this table 
  return Genre;
};