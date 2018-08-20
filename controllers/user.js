const joi = require('joi');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

module.exports = class User {
	/*
  ** Default
  */
  constructor(app) {
		this._app = app;
	}

	/*
  ** Signup
  **    Create a new user account and send an activation link.
  */
	signup(req, res) {
    var datas = req.body;
    var self = this;

    // Validate data format
    joi.validate(datas, joi.object().keys({
    	firstName: joi.string().required(),
      lastName: joi.string().required(),
      username: joi.string().regex(/^[a-zA-Z0-9_]{6,20}$/).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required()
    }), (error, result) => {
      // Invalid data format
      if (error) {
        console.error(error);
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Encrypt password
      bcrypt.hash(datas.password, 10, function(error, hash) {
        // Password encryption error
        if (error) {
          console.error(error);
          return res.status(500).json({
            error: 'Unable to encrypt password'
          });
        }

        // Encrypted password
        datas.password = hash;

        // Insert into database
        self._app.models.user.model.build({
          firstName: datas.firstName,
          lastName: datas.lastName,
          username: datas.username,
          email: datas.email,
          password: datas.password
        })
        .save()
        .then((user) => {
          // Send the account confirmation link
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
                Start your Fitletics experience now by activating your account. Click on the following link <a href="http://192.168.1.26:3000/activate/${user.dataValues.activationToken}">http://192.168.1.26:3000/activate/${user.dataValues.activationToken}</a>.
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

          // Return a success message
          res.status(200).json({
            success: 'Congratulations, you are a Fitletics Coach subscriber. Check your emails to activate your account.'
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            error: 'Database query error'
          });
        });
  		});
    });
	}

  /*
  ** Signin
  **    Check user username and password and return a json web token.
  */
  signin(req, res) {
    var datas = req.body;
    var self = this;

    // Validate data format
		joi.validate(datas, joi.object().keys({
      username: joi.string().regex(/^[a-zA-Z0-9_]{6,20}$/).required(),
			password: joi.string().min(6).required()
		}), (error, result) => {
      // Invalid data format
      if (error) {
        console.error(error);
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Match user email in database
      this._app.models.user.model.findOne({
        where: {
          username: datas.username
        }
      })
      .then((user) => {
        // Email not found
        if (!user) {
          console.error('User account not found');
          return res.status(401).json({
            error: 'User account not found'
          });
        }
        // Account not activated
        else if (!user.active) {
          console.error('User account not active');
          return res.status(403).json({
            error: 'User account not active'
          });
        }

        // Compare password
        bcrypt.compare(datas.password, user.password)
        .then((match) => {
          // Passwords not matching
          if (!match) {
            console.log('Unauthorised access');
            res.status(401).json({
              error: 'Unauthorised access'
            });
          }

          // Create a new json web token with 60 seconds expiration
          var token = jwt.sign({ id: user.id }, self._app.config.jsonwebtoken.secret, { expiresIn: 60 });

          // Send back token
          res.status(200).json({
            token: token
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            error: 'Unable to decrypt password'
          });
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({
          error: 'Database query error'
        });
      });
    });
  }

	/*
  ** Read
  **    Get user account informations using a json web token to retreive user "id".
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

	/*
  ** Update
  **    Update user account informations using a json web token to retreive user "id".
  */
	update(req, res) {
    var datas = req.body;
    var self = this;

    // Add token on datas to validate
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
      // Invalid datas format
      if (error) {
        console.error(error);
        return res.status(400).json({
          error: error.details[0].message
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

        // Update database entry
        self._app.models.user.model.update({
          firstName: datas.firstName,
          lastName: datas.lastName,
          username: datas.username,
          email: datas.email,
          password: datas.password
        }, {
          where: {
            id: decoded.id
          }
        })
        .then((rows) => {
          // Token not matching user id
          if (!rows[0]) {
            console.error('Unauthorised session token');
            return res.status(401).json({
              error: 'Unauthorised session token'
            });
          }

          res.status(200).json(result)
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            error: 'Database query error'
          });
        });
      });
    });
	}

  /*
	** Activate
	**   Activate user account by setting user "active" column to TRUE.
	*/
	activate(req, res) {
    var datas = req.body;
    var self = this;

    // Validate datas format
		joi.validate(datas, joi.object().keys({
			token: joi.string().required()
		}), (error, result) => {
      // Invalid datas format
      if (error) {
        console.error(error);
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Update database entry
      self._app.models.user.model.findOne({
        active: false,
        activationToken: datas.token
      })
      .then((user) => {
        if (!user) {
          console.error('Invalid activation token');
          return res.status(401).json({
            error: 'Invalid activation token'
          });
        } else if (user.active) {
          console.error('User account already active');
          return res.status(401).json({
            error: 'User account already active'
          });
        }

        user.update({
          active: true,
  				activationToken: null
        })
        .then((rows) => {
          // OK
          res.status(200).json({
            success: 'User account activated'
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            error: 'Database query error'
          });
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({
          error: 'Database query error'
        });
      });
    });
	}

	/*
  ** Deactivate
  **    Deactivate user account without deleting anything by setting user "active" column to FALSE.
  */
	deactivate(req, res) {
    var datas = req.cookies;
    var self = this;

    // Validate datas format
    joi.validate(datas, joi.object().keys({
      token: joi.string().required(),
    }), (error, result) => {
      // Invalid datas format
      if (error) {
        console.error(error);
        return res.status(400).json({
          error: error.details[0].message
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

        // Update database entry
        self._app.models.user.model.update({
          active: false
        }, {
          where: {
            id: decoded.id
          }
        })
        .then(rows => {
          // Token not found
  				if (!rows[0]) {
            console.error('Invalid activation token');
            return res.status(401).json({
              error: 'Invalid activation token'
            });
          }

          // OK
          res.status(200).json({
            success: 'User account deactivated'
          });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({
            error: 'Database query error'
          });
        });
      });
    });
	}

  /*
  ** Reset
  **    Reset user password and send it by email.
  */
  reset(req, res) {
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

    // Validate data format
    joi.validate(datas, joi.object().keys({
      email: joi.string().email().required(),
    }), (error, result) => {
      // Invalid data format
      if (error) {
        console.error(error);
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Encrypt password
      bcrypt.hash(newPassword, 10, function(error, hash) {
        // Password encryption error
        if (error) {
          console.error(error);
          return res.status(500).json({
            error: 'Unable to encrypt password'
          });
        }

        // Match user email in database
        self._app.models.user.model.update({
          password: hash
        }, {
          where: {
            email: datas.email
          }
        })
        .then((rows) => {
          // Email not found
          if (!rows[0]) {
            console.error('User account not found');
            return res.status(401).json({
              error: 'User account not found'
            });
          }

          // Send the new password
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
                You requested to reset your password. Your new password is <strong>${newPassword}</strong>. You can sign in by clicking the folling link <a href="http://192.168.1.26:3000/signin">http://192.168.1.26:3000/signin</a>.
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

          // OK
          res.status(200).json({
            success: 'Your password was reset. Check your emails to recover your new password.'
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: 'Database query error'
          });
        });
      });
    });
  }
}
