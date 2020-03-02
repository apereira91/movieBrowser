module.exports = function (sequelize, DataTypes) {
  var Movie = sequelize.define("Movie", {
    movieId: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });
  Movie.associate = function (models) {
    Movie.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Movie;
};