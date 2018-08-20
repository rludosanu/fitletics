const joi = require('joi');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

module.exports = class Workout {
	/*
  ** Default
  */
  constructor(app) {
		this._app = app;
	}

	/*
  **
  **
  */
	read(req, res) {
    var datas = req.cookies;
    var self = this;

    // Validate data format
    joi.validate(datas, joi.object().keys({
    	token: joi.string().required(),
    }), (error, result) => {
      // Invalid data format
      if (error) {
        console.error(error);
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Check if token is not blacklisted
      if (self.blacklistedTokens.indexOf(datas.tokens) != -1) {
        return res.status(500).json({
          error: 'Invalid session token'
        });
      }

      // Decrypt json web token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        // Token not decrypted
        if (error) {
          console.error(error);
          return res.status(400).json({
            error: error
          });
        }

        // Read from database
        self._app.models.user.model.findOne({
          attributes: ['firstName', 'lastName', 'username', 'email'],
          where: {
            id: decoded.id
          }
        })
        .then(result => res.status(200).json(result))
        .catch(error => {
          console.error(error);
          res.status(500).json({
            error: 'Database query error'
          });
        });
      });
		});
	}
};
