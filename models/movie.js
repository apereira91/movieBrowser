module.exports = function (sequelize, DataTypes) {
  var Movie = sequelize.define("Movie", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    movieId: { type: DataTypes.STRING },
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