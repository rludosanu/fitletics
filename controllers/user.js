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
  **    Create a new user account and send an link containing the activation
  **    token.
  **
  ** SUCCESS
  **    200 OK: Activation token
  **
  ** ERROR
  **    400 Bad Request: Invalid datas
  **    500 Internal Server Error: Password encryption failed
  **    500 Internal Server Error: Database query failed
  *****************************************************************************/
	signup(req, res) {
    var datas = req.body;
    var self = this;
    var url = self._app.config.server.host + ':' + this._app.config.server.port;

    // Validate datas
    joi.validate(datas, joi.object().keys({
    	firstName: joi.string().required(),
      lastName: joi.string().required(),
      username: joi.string().regex(/^[a-zA-Z0-9_]{6,20}$/).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required()
    }), (error, result) => {
      if (error) {
        // 400 Bad Request: Invalid datas
        return res.status(400).json('Invalid datas');
      }

      // Encrypt password
      bcrypt.hash(datas.password, 10, function(error, hash) {
        if (error) {
          // 500 Internal Server Error: Password encryption failed
          return res.status(500).json('Password encryption failed');
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
          	from: `Fitletics Coach<${self._app.config.mail.auth.user}>`,
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
                You have any questions or comments ? Sends us an email at ${self._app.config.mail.auth.user}. A member of our team will take care of you as soon as possible.
              </div>
          		<div>
                Enjoy your account,
                <br />
                <strong>Fitletics Team</strong>
              </div>
          	</div>
          	`
          });

          // 200 OK: Activation token
          res.status(200).json(user.dataValues.activationToken);
        })
        // 500 Internal Server Error: Database query failed
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
  **    200 OK: Session token (jwt)
  **
  ** ERROR
  **    400 Bad Request: Invalid datas
  **    403 Forbidden: User not active
  **    403 Forbidden: Invalid password
  **    404 Not Found: Username not found
  **    500 Internal Server Error: Password decryption failed
  **    500 Internal Server Error: Database query failed
  *****************************************************************************/
  signin(req, res) {
    var datas = req.body;
    var self = this;

    // Validate datas
		joi.validate(datas, joi.object().keys({
      username: joi.string().regex(/^[a-zA-Z0-9_-]{6,20}$/).required(),
			password: joi.string().min(6).required()
		}), (error, result) => {
      if (error) {
        // 400 Bad Request: Invalid datas
        return res.status(400).json('Invalid datas');
      }

      // Find user
      this._app.models.user.model.findOne({
        where: {
          username: datas.username
        }
      })
      .then(user => {
        if (!user) {
          // 404 Not Found: Username not found
          return res.status(401).json('User not found');
        } else if (!user.active) {
          // 403 Forbidden: User not active
          return res.status(403).json('User not active');
        }

        // Compare passwords
        bcrypt.compare(datas.password, user.password, (error, match) => {
          if (error) {
            // 500 Internal Server Error: Password decryption failed
            return res.status(500).json('Password decryption failed');
          } else if (!match) {
            // 403 Forbidden: Invalid password
            return res.status(403).json('Invalid password');
          }

          // New JWT
          var token = jwt.sign({ id: user.id }, self._app.config.jsonwebtoken.secret);

          // 200 OK: Session token (jwt)
          res.status(200).json(token);
        });
      })
      // 500 Internal Server Error: Database query failed
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
  **    200 OK: User object
  **
  ** ERROR
  **    400 Bad Request: Invalid data format
  **    500 Internal Server Error: Session token decryption failed
  **    500 Internal Server Error: Database query failed
  *****************************************************************************/
	read(req, res) {
    var datas = req.cookies;
    var self = this;

    // Validate datas
    joi.validate(datas, joi.object().keys({
    	token: joi.string().required(),
    }), (error, result) => {
      if (error) {
        // 400 Bad Request: Invalid datas
        return res.status(400).json(error.details[0].message);
      }

      // Decrypt JWT
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // 500 Internal Server Error: Session token decryption failed
          return res.status(500).json('Session token decryption failed');
        }

        // Find user
        self._app.models.user.model.findOne({
          attributes: ['firstName', 'lastName', 'username', 'email'],
          where: {
            id: decoded.id
          }
        })
        // 200 OK: User object
        .then(result => res.status(200).json(result))
        // 500 Internal Server Error: Database query failed
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
  **    200 OK: Success
  **
  ** ERROR
  **    304 Not Modified: User not modified
  **    400 Bad Request: Invalid datas
  **    400 Bad Request: Malformed token
  **    403 Forbidden: Invalid password
  **    404 Not Found: User not found
  **    500 Internal Server Error: Session token decryption failed
  **    500 Internal Server Error : Password decryption failed
  **    500 Internal Server Error : Database query failed
  *****************************************************************************/
	updateProfile(req, res) {
    var datas = req.body;
    var self = this;

    // Add session token to datas
    datas.token = req.cookies.token;

    // Validate datas
    joi.validate(datas, joi.object().keys({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      username: joi.string().regex(/^[a-zA-Z0-9_]{6,20}$/).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      token: joi.string().required()
    }), (error, result) => {
      if (error) {
        // 400 Bad Request: Invalid datas
        return res.status(400).json('Invalid datas');
      }

      // Decrypt JWT
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // 500 Internal Server Error : Session token decryption failed
          return res.status(500).json('Session token decryption failed');
        }

        // Find user
        self._app.models.user.model.findOne({
          where: {
            id: decoded.id
          }
        })
        .then(user => {
          if (!user) {
            // 404 Not Found: User not found
            return res.status(404).json('User not found');
          }

          // Compare passwords
          bcrypt.compare(datas.password, user.dataValues.password, (error, match) => {
            if (error) {
              // 500 Internal Server Error : Password decryption failed
              return res.status(500).json('Password decryption failed');
            } else if (!match) {
              // 403 Forbidden: Invalid password
              return res.status(403).json('Invalid password');
            }

            // Update database entry
            user.update({
              firstName: datas.firstName,
              lastName: datas.lastName,
              username: datas.username,
              email: datas.email
            })
            .then(user => {
              if (!Object.keys(user._changed).length) {
                // 304 Not Modified: User not modified
                return res.status(304);
              }

              // 200 OK: Success
              res.status(200).json('Profile updated');
            })
            // 500 Internal Server Error : Database query failed
            .catch(error => res.status(500).json(error));
          });
        })
        // 500 Internal Server Error : Database query failed
        .catch(error => res.status(500).json(error));
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
  **    200 OK: Success
  **
  ** ERROR
  **    304 Not Modified: Password not updated
  **    400 Bad Request: Invalid data format
  **    400 Bad Request: Malformed token
  **    403 Forbidden: Invalid password
  **    404 Not Found: User not found
  **    500 Internal Server Error : Session token decryption failed
  **    500 Internal Server Error: Password encryption failed
  **    500 Internal Server Error : Password decryption failed
  **    500 Internal Server Error : Database query failed
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
        // 400 Bad Request: Invalid data format
        return res.status(400).json(error.details[0].message);
      }

      // Decrypt session token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // 500 Internal Server Error : Session token decryption failed
          return res.status(400).json('Session token decryption failed');
        }

        // Fetch user from database
        self._app.models.user.model.findOne({
          where: {
            id: decoded.id
          }
        })
        .then(user => {
          if (!user) {
            // 404 Not Found: User not found
            return res.status(404).json('User not found');
          }

          // Compare passwords
          bcrypt.compare(datas.password, user.dataValues.password, (error, match) => {
            if (error) {
              // 500 Internal Server Error : Password decryption failed
              return res.status(500).json('Password decryption failed');
            } else if (!match) {
              // 403 Forbidden: Invalid password
              return res.status(403).json('Invalid password');
            }

            // Encrypt new password
            bcrypt.hash(datas.newPassword, 10, function(error, hash) {
              if (error) {
                // 500 Internal Server Error: Password encryption failed
                return res.status(500).json('Password encryption failed');
              }

              // Update database
              user.update({
                password: hash
              })
              .then(user => {
                if (!Object.keys(user._changed).length) {
                  // 304 Not Modified: User not modified
                  return res.status(304);
                }

                // 200 OK: Success
                res.status(200).json('Password updated');
              })
              // 500 Internal Server Error : Database query failed
              .catch(error => res.status(500).json(error.parent.sqlMessage));
            });
          });
        })
        // 500 Internal Server Error : Database query failed
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
  **    200 OK: Success
  **
  ** ERROR
  **    304 Not Modified: Account already active
  **    400 Bad Request: Invalid data format
  **    404 Not Found: User not found or account already active
  **    500 Internal Server Error: Database query failed
  *****************************************************************************/
	activate(req, res) {
    var datas = req.body;
    var self = this;

    // Validate datas
		joi.validate(datas, joi.object().keys({
			token: joi.string().required()
		}), (error, result) => {
      if (error) {
        // 400 Bad Request: Invalid datas
        return res.status(400).json('Invalid datas');
      }

      // Find user
      self._app.models.user.model.findOne({
        where: {
          active: false,
          activationToken: datas.token
        }
      })
      .then(user => {
        if (!user) {
          // 404 Not Found: User not found or account already active
          return res.status(404).json('User not found or account already active');
        }

        // Update user
        user.update({
          active: true,
  				activationToken: null
        })
        // Database updated
        .then(user => {
          if (!Object.keys(user._changed).length) {
            // 304 Not Modified
            return res.status(304);
          }

          // Send activation confirmation by email
          nodemailer.createTransport(self._app.config.mail).sendMail({
            from: `Fitletics Coach<${self._app.config.mail.auth.user}>`,
            to: user.datasValues.email,
            subject: 'Your account is now active',
            html: `
            <div style="color: #444444; font-size: 15px; margin: 45px 0px; width: 500px;">
              <div style="font-size: 22px; margin-bottom: 25px;">
                Hi ${user.datasValues.firstName}!
              </div>
              <div style="margin-bottom: 20px;">
                You just activated your new Fitletics account ! You can sign in by clicking the folling link <a href="http://${url}/signin">http://${url}/signin</a>.
              </div>
              <div style="margin-bottom: 20px;">
                You have any questions or comments ? Sends us an email at ${self._app.config.mail.auth.user}. A member of our team will take care of you as soon as possible.
              </div>
              <div>
                Enjoy your account,
                <br />
                <strong>Fitletics Team</strong>
              </div>
            </div>
            `
          });

          // 200 OK: Success
          res.status(200).json('User activated');
        })
        // 500 Internal Server Error: Database query failed
        .catch(error => res.status(500).json(error));
      })
      // 500 Internal Server Error: Database query failed
      .catch(error => res.status(500).json(error));
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
  **    200 OK: Success
  **
  ** ERROR
  **    304 Not Modified: User not deactivated
  **    400 Bad Request: Invalid datas
  **    404 Not Found: User not found
  **    500 Internal Server Error : Session token decryption failed
  **    500 Internal Server Error : Database query failed
  *****************************************************************************/
	deactivate(req, res) {
    var datas = req.cookies;
    var self = this;

    // Validate datas format
    joi.validate(datas, joi.object().keys({
      token: joi.string().required(),
    }), (error, result) => {
      if (error) {
        // 400 Bad Request: Invalid datas
        return res.status(400).json(error.details[0].message);
      }

      // Decrypt session token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // 500 Internal Server Error : Session token decryption failed
          return res.status(400).json(error);
        }

        // Find user
        self._app.models.user.model.findOne({
          where: {
            id: decoded.id
          }
        })
        .then(user => {
          if (!user) {
            // 404 Not Found: User not found
            res.status(404).json('User not found');
          }

          // Update user
          user.update({
            active: false
          })
          .then(user => {
            if (!Object.keys(user._changed).length) {
              // 304 Not Modified
              return res.status(304);
            }

            // 200 OK: Success
            res.status(200).json('Account deactivated');
          })
          // 500 Internal Server Error : Database query failed
          .catch(error => res.status(500).json(error.parent.sqlMessage));
        })
        // 500 Internal Server Error : Database query failed
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
  **    304 Not Modified: Password not modified
  **    400 Bad Request: Invalid datas
  **    404 Not Found: User not found
  **    500 Internal Server Error : Password encryption failed
  **    500 Internal Server Error : Database query failed
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
        // 400 Bad Request: Invalid datas
        return res.status(400).json('Invalid datas');
      }

      // Encrypt new password
      bcrypt.hash(newPassword, 10, function(error, hash) {
        if (error) {
          // 500 Internal Server Error : Password encryption failed
          return res.status(500).json(error);
        }

        // Find user
        self._app.models.user.model.findOne({
          where: {
            email: datas.email
          }
        })
        .then(user => {
          if (!user) {
            // 404 Not Found: User not found
            return res.status(404).json('User not found');
          }

          // Update user
          user.update({
            password: hash
          })
          .then(user => {
            if (!Object.keys(user._changed).length) {
              // 304 Not Modified
              return res.status(304);
            }

            // Send password by email
            nodemailer.createTransport(self._app.config.mail).sendMail({
              from: `Fitletics Coach<${self._app.config.mail.auth.user}>`,
              to: datas.email,
              subject: 'Your password has been reset',
              html: `
              <div style="color: #444444; font-size: 15px; margin: 45px 0px; width: 500px;">
                <div style="font-size: 22px; margin-bottom: 25px;">
                  Hi ${user.datasValues.firstName}!
                </div>
                <div style="margin-bottom: 20px;">
                  You requested to reset your password. Your new password is <strong>${newPassword}</strong>. You can sign in by clicking the folling link <a href="http://${url}/signin">http://${url}/signin</a>.
                </div>
                <div style="margin-bottom: 20px;">
                  You have any questions or comments ? Sends us an email at ${self._app.config.mail.auth.user}. A member of our team will take care of you as soon as possible.
                </div>
                <div>
                  Enjoy your account,
                  <br />
                  <strong>Fitletics Team</strong>
                </div>
              </div>
              `
            });

            // 200 OK: Success
            return res.status(200).json('Password modified');
          })
          // 500 Internal Server Error : Database query failed
          .catch(error => res.status(500).json(error.parent.sqlMessage));
        })
        // 500 Internal Server Error : Database query failed
        .catch(error => res.status(500).json(error.parent.sqlMessage));
      });
    });
  }
}
