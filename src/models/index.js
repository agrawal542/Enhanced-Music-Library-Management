'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development'; // Default to 'development' if NODE_ENV is not set
const db = {};
let sequelize;

try {
  if (env === 'production') {
    // Use environment variables for production configuration
    sequelize = new Sequelize(
      process.env.DB_DATABASE,   // Database name
      process.env.DB_USERNAME,   // Database username
      process.env.DB_PASSWORD,   // Database password
      {
        host: process.env.DB_HOST,           // Database host
        port: process.env.DB_PORT || 3306,   // Default MySQL port
        dialect: process.env.DB_DIALECT || 'mysql', // Default dialect
        dialectOptions: {
          ssl: {
            require: process.env.DB_DIALECT_OPTIONS_SSL_REQUIRE === 'true', // Convert string to boolean
            rejectUnauthorized: process.env.DB_DIALECT_OPTIONS_SSL_REJECT_UNAUTHORIZED === 'true' // Convert string to boolean
          }
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false, // Enable logging in development
      }
    );
  } else {
    // Use `config.json` for development or other environments
    const config = require(path.join(__dirname, '../config/config.json'))[env];
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
      sequelize = new Sequelize(config.database, config.username, config.password, config);
    }
  }

  console.log(
    `Database connection established successfully in '${env}' environment.`
  );
} catch (error) {
  console.error(`Failed to connect to the database in '${env}' environment:`, error.message);
  process.exit(1); // Exit process on database connection failure
}

// Dynamically load all models in the current directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Run model associations if defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
