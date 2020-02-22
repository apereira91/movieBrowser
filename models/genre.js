module.exports = function (sequelize, DataTypes) {
  var Genre = sequelize.define("Genre", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Genre.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Genre.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  // need to call sequelize.synch but only for this table
  return Genre;
};