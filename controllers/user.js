const joi = require('joi');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

module.exports = class User {
  constructor(app) {
		this._app = app;
	}

  /*****************************************************************************
  ** ROUTE
  **    POST /api/user/signup
  **
  ** DESCRIPTION
  **    Create a new user account and send an activation link.
  **
  ** SUCCESS
  **    200 : User account created.
  **
  ** ERROR
  **    400 : Invalid data format
  **    500 : Password encryption failed
  **    500 : Database insert failed
  *****************************************************************************/
	signup(req, res) {
    var datas = req.body;
    var self = this;
    var url = self._app.config.server.host + ':' + this._app.config.server.port;

    // Validate data format
    joi.validate(datas, joi.object().keys({
    	firstName: joi.string().required(),
      lastName: joi.string().required(),
      username: joi.string().regex(/^[a-zA-Z0-9_]{6,20}$/).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required()
    }), (error, result) => {
      if (error) {
        // Invalid data format
        return res.status(400).json(error.details[0].message);
      }

      // Encrypt password
      bcrypt.hash(datas.password, 10, function(error, hash) {
        if (error) {
          // Encryption failed
          return res.status(500).json(error);
        }

        // Insert user into database
        self._app.models.user.model.build({
          firstName: datas.firstName,
          lastName: datas.lastName,
          username: datas.username,
          email: datas.email,
          password: hash
        })
        .save()
        .then(user => {
          // Send confirmation link
          nodemailer.createTransport(self._app.config.mail).sendMail({
          	from: 'Fitletics Coach<fitleticscoach@gmail.com>',
          	to: datas.email,
          	subject: 'Welcome to Fitletics Coach',
          	html: `
          	<div style="color: #444444; font-size: 15px; margin: 45px 0px; width: 500px;">
          		<div style="font-size: 22px; margin-bottom: 25px;">
                Hi ${datas.firstName} !
              </div>
              <div style="margin-bottom: 20px;">
                Congratulations, you are a Fitletics Coach subscriber. You have decided to lead a healthier and happier life.
              </div>
              <div style="margin-bottom: 20px;">
                Start your Fitletics experience now by activating your account. Click on the following link <a href="http://${url}/activate/${user.dataValues.activationToken}">http://${url}/activate/${user.dataValues.activationToken}</a>
              </div>
              <div style="margin-bottom: 20px;">
                You have any questions or comments ? Sends us an email at fitleticscoach@gmail.com. A member of our team will take care of you as soon as possible.
              </div>
          		<div>
                Enjoy your account,
                <br />
                <strong>Fitletics Team</strong>
              </div>
          	</div>
          	`
          });

          // Send back success message
          res.status(200).json('User account created.');
        })
        // Database query failed
        .catch(error => res.status(500).json(error.parent.sqlMessage));
  		});
    });
	}

  /*****************************************************************************
  ** ROUTE
  **    POST /api/user/signin
  **
  ** DESCRIPTION
  **    Checks the couple username:password and returns a new session token.
  **
  ** SUCCESS
  **    200 : User account created.
  **
  ** ERROR
  **    400 : Invalid data format
  **    401 : Username not found
  **    403 : Account not active
  **    401 : Passwords do not match
  **    500 : Password decryption failed
  **    500 : Database select failed
  *****************************************************************************/
  signin(req, res) {
    var datas = req.body;
    var self = this;

    // Validate data format
		joi.validate(datas, joi.object().keys({
      username: joi.string().regex(/^[a-zA-Z0-9_-]{6,20}$/).required(),
			password: joi.string().min(6).required()
		}), (error, result) => {
      if (error) {
        // Invalid data format
        return res.status(400).json(error.details[0].message);
      }

      // Fetch user from database
      this._app.models.user.model.findOne({
        where: {
          username: datas.username
        }
      })
      .then(user => {
        if (!user) {
          // User not found
          return res.status(401).json('Username not found.');
        } else if (!user.active) {
          // Account not active
          return res.status(403).json('Account not activated.');
        }

        // Compare request and database passwords
        bcrypt.compare(datas.password, user.password, (error, match) => {
          if (error) {
            // Comparison failed
            return res.status(500).json(error);
          } else if (!match) {
            // Passwords don't match
            return res.status(401).json('Invalid password.');
          }

          // Generate new session token
          var token = jwt.sign({ id: user.id }, self._app.config.jsonwebtoken.secret);

          // Send back session token
          res.status(200).json(token);
        });
      })
      // Database query failed
      .catch(error =>  res.status(500).json(error.parent.sqlMessage));
    });
  }

  /*****************************************************************************
  ** ROUTE
  **    POST /api/user/read
  **
  ** DESCRIPTION
  **    Get user account informations.
  **
  ** SUCCESS
  **    200 : User account created.
  **
  ** ERROR
  **    400 : Invalid data format
  **    500 : Password encryption failed
  **    500 : Database insert failed
  *****************************************************************************/
	read(req, res) {
    var datas = req.cookies;
    var self = this;

    // Validate data format
    joi.validate(datas, joi.object().keys({
    	token: joi.string().required(),
    }), (error, result) => {
      if (error) {
        // Invalid data format
        return res.status(400).json(error.details[0].message);
      }

      // Decrypt session token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // Decryption failed
          return res.status(400).json(error);
        }

        // Fetch user from database
        self._app.models.user.model.findOne({
          attributes: ['firstName', 'lastName', 'username', 'email'],
          where: {
            id: decoded.id
          }
        })
        // Send back user datas
        .then(result => res.status(200).json(result))
        // Database query failed
        .catch(error => res.status(500).json(error.parent.sqlMessage));
      });
		});
	}

  /*****************************************************************************
  ** ROUTE
  **    PUT /api/user/update/profile
  **
  ** DESCRIPTION
  **    Updates the user's profile informations.
  **
  ** SUCCESS
  **    200 : Profile updated
  **
  ** ERROR
  **    400 : Invalid data format
  **    400 : Malformed token
  **    401 : User not found
  **    401 : Passwords do not match
  **    500 : Password encryption failed
  **    500 : Database select failed
  **    500 : Password decryption failed
  **    500 : Database update failed
  *****************************************************************************/
	updateProfile(req, res) {
    var datas = req.body;
    var self = this;

    // Add session token to datas
    datas.token = req.cookies.token;

    // Validate datas format
    joi.validate(datas, joi.object().keys({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      username: joi.string().regex(/^[a-zA-Z0-9_]{6,20}$/).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      token: joi.string().required()
    }), (error, result) => {
      if (error) {
        // Invalid datas format
        return res.status(400).json(error.details[0].message);
      }

      // Decrypt session token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // Decryption failed
          return res.status(400).json(error);
        }

        // Fetch user from database
        self._app.models.user.model.findOne({
          where: {
            id: decoded.id
          }
        })
        .then(user => {
          if (!user) {
            // User not found
            return res.status(401).json('User not found');
          }

          // Compare passwords
          bcrypt.compare(datas.password, user.dataValues.password, (error, match) => {
            if (error) {
              // Comparison error
              return res.status(500).json(error);
            } else if (!match) {
              // Passwords don't match
              return res.status(401).json('Passwords do not match');
            }

            // Update database entry
            user.update({
              firstName: datas.firstName,
              lastName: datas.lastName,
              username: datas.username,
              email: datas.email
            })
            // Database updated
            .then(rows => res.status(200).json('Profile updated'))
            // Database query failed
            .catch(error => res.status(500).json(error.parent.sqlMessage));
          });
        })
        // Database query failed
        .catch(error => res.status(500).json(error.parent.sqlMessage));
      });
    });
	}

  /*****************************************************************************
  ** ROUTE
  **    PUT /api/user/update/password
  **
  ** DESCRIPTION
  **    Updates the user's "password" column in database with $newPassword.
  **
  ** SUCCESS
  **    200 : The $newPassword has been saved
  **
  ** ERROR
  **    400 : Invalid data format
  **    400 : Malformed token
  **    401 : User not found
  **    401 : Passwords do not match
  **    500 : Password encryption failed
  **    500 : Database select failed
  **    500 : Database update failed
  **    500 : Password decryption failed
  *****************************************************************************/
  updatePassword(req, res) {
    var datas = req.body;
    var self = this;

    // Add session token to datas
    datas.token = req.cookies.token;

    // Validate datas format
    joi.validate(datas, joi.object().keys({
      password: joi.string().min(6).required(),
      newPassword: joi.string().min(6).required(),
      token: joi.string().required()
    }), (error, result) => {
      if (error) {
        // Invalid datas format
        return res.status(400).json(error.details[0].message);
      }

      // Decrypt session token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // Decryption failed
          return res.status(400).json(error);
        }

        // Fetch user from database
        self._app.models.user.model.findOne({
          where: {
            id: decoded.id
          }
        })
        .then(user => {
          if (!user) {
            // User not found
            return res.status(401).json('User not found');
          }

          // Compare passwords
          bcrypt.compare(datas.password, user.dataValues.password, (error, match) => {
            if (error) {
              // Comparison error
              return res.status(500).json(error);
            } else if (!match) {
              // Passwords don't match
              return res.status(401).json('Passwords do not match');
            }

            // Encrypt new password
            bcrypt.hash(datas.newPassword, 10, function(error, hash) {
              if (error) {
                // Encryption error
                return res.status(500).json(error);
              }

              // Update database
              user.update({
                password: hash
              })
              // Update success
              .then(rows => res.status(200).json('Password updated'))
              // Database query error
              .catch(error => res.status(500).json(error.parent.sqlMessage));
            });
          });
        })
        // Database query error
        .catch(error => res.status(500).json(error.parent.sqlMessage));
      });
    });
  }

  /*****************************************************************************
  ** ROUTE
  **    PUT /api/user/activate
  **
  ** DESCRIPTION
  **    Activate user account.
  **
  ** SUCCESS
  **    200 : User account activated.
  **
  ** ERROR
  **    400 : Invalid data format
  **    401 : Invalid activation token
  **    401 : Account already active
  **    500 : Database select failed
  **    500 : Database update failed
  *****************************************************************************/
	activate(req, res) {
    var datas = req.body;
    var self = this;

    // Validate datas format
		joi.validate(datas, joi.object().keys({
			token: joi.string().required()
		}), (error, result) => {
      if (error) {
        // Invalid datas format
        return res.status(400).json(error.details[0].message);
      }

      // Fetch user from database
      self._app.models.user.model.findOne({
        active: false,
        activationToken: datas.token
      })
      .then(user => {
        if (!user) {
          // User not found
          return res.status(401).json('User not found');
        } else if (user.active) {
          // Account already active
          return res.status(401).json('Account already active');
        }

        // Update database
        user.update({
          active: true,
  				activationToken: null
        })
        // Database updated
        .then(rows => res.status(200).json('Account activated'))
        // Database query error
        .catch(error => res.status(500).json(error.parent.sqlMessage));
      })
      // Database query error
      .catch(error => res.status(500).json(error.parent.sqlMessage));
    });
	}

  /*****************************************************************************
  ** ROUTE
  **    PUT /api/user/deactivate
  **
  ** DESCRIPTION
  **    Deactivate account without deleting records.
  **
  ** SUCCESS
  **    200 : Account deactivated.
  **
  ** ERROR
  **    400 : Invalid data format
  **    400 : Session token decryption failed
  **    401 : User not found or account already deactivated
  **    500 : Database update failed
  *****************************************************************************/
	deactivate(req, res) {
    var datas = req.cookies;
    var self = this;

    // Validate datas format
    joi.validate(datas, joi.object().keys({
      token: joi.string().required(),
    }), (error, result) => {
      if (error) {
        // Invalid datas format
        return res.status(400).json(error.details[0].message);
      }

      // Decrypt session token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // Decryption failed
          return res.status(400).json(error);
        }

        // Update database
        self._app.models.user.model.update({
          active: false
        }, {
          where: {
            id: decoded.id
          }
        })
        .then(rows => {
  				if (!rows[0]) {
            // User not found or account already deactivated
            return res.status(401).json('User not found or account already deactivated');
          }

          res.status(200).json('Account deactivated');
        })
        // Database query error
        .catch(error => res.status(500).json(error.parent.sqlMessage));
      });
    });
	}

  /*****************************************************************************
  ** ROUTE
  **    PUT /api/user/reset/password
  **
  ** DESCRIPTION
  **    Reset user's password and send it by email.
  **
  ** SUCCESS
  **    200 : Password reset.
  **
  ** ERROR
  **    400 : Invalid data format
  **    500 : Password encryption failed
  **    401 : User not found
  **    500 : Database update failed
  *****************************************************************************/
  resetPassword(req, res) {
    var datas = req.body;
    var self = this;
    var generatePassword = function() {
      var password = '';
      var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < 8; i++) {
        password += base.charAt(Math.floor(Math.random() * base.length));
      }

      return password;
    };
    var newPassword = generatePassword();
    var url = self._app.config.server.host + ':' + this._app.config.server.port;

    // Validate data format
    joi.validate(datas, joi.object().keys({
      email: joi.string().email().required(),
    }), (error, result) => {
      if (error) {
        // Invalid data format
        return res.status(400).json(error.details[0].message);
      }

      // Encrypt new password
      bcrypt.hash(newPassword, 10, function(error, hash) {
        if (error) {
          // Encryption error
          return res.status(500).json(error);
        }

        // Update database
        self._app.models.user.model.update({
          password: hash
        }, {
          where: {
            email: datas.email
          }
        })
        .then(rows => {
          if (!rows[0]) {
            // User not found
            return res.status(401).json('User not found');
          }

          /* Send new password by email */
          nodemailer.createTransport(self._app.config.mail).sendMail({
            from: 'Fitletics Coach<fitleticscoach@gmail.com>',
            to: datas.email,
            subject: 'Your password has been reset',
            html: `
            <div style="color: #444444; font-size: 15px; margin: 45px 0px; width: 500px;">
              <div style="font-size: 22px; margin-bottom: 25px;">
                Hi !
              </div>
              <div style="margin-bottom: 20px;">
                You requested to reset your password. Your new password is <strong>${newPassword}</strong>. You can sign in by clicking the folling link <a href="http://${url}/signin">http://${url}/signin</a>.
              </div>
              <div style="margin-bottom: 20px;">
                You have any questions or comments ? Sends us an email at fitleticscoach@gmail.com. A member of our team will take care of you as soon as possible.
              </div>
              <div>
                Enjoy your account,
                <br />
                <strong>Fitletics Team</strong>
              </div>
            </div>
            `
          });

          res.status(200).json('Password reset');
        })
        // Database query error
        .catch(error => res.status(500).json(error.parent.sqlMessage));
      });
    });
  }
}
