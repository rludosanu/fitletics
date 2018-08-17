const Sequelize = require('sequelize');

module.exports = {
  server: {
    host: '',
    port: 
  },
  database: {
    host: '',
    port: ,
    dialect: '',
    operatorsAliases: Sequelize.Op,
    database: '',
    username: '',
    password: ''
  },
  models: {
    sync: false
  },
  mail: {
    service: '',
    auth: {
      user: '',
      pass: ''
    }
  }
};
