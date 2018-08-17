const Sequelize = require('sequelize');

module.exports = {
  server: {
    host: '127.0.0.1',
    port: 3000
  },
  database: {
    host: '',
    port: 0000,
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
