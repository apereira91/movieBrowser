var Sequelize = require("sequelize");

let sequelize = new Sequelize("sequelize_library", "root", "", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        idle: 1000
    }
});

modules.exports = sequelize; 