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

    this.blacklistedTokens = [];
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

    /* Validate datas format */
    joi.validate(datas, joi.object().keys({
    	firstName: joi.string().required(),
      lastName: joi.string().required(),
      username: joi.string().regex(/^[a-zA-Z0-9_]{6,20}$/).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required()
    }), (error, result) => {
      /* Invalid data format */
      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      /* Encrypt password */
      bcrypt.hash(datas.password, 10, function(error, hash) {
        /* Password encryption failed */
        if (error) {
          return res.status(500).json({
            error: 'Unable to encrypt password'
          });
        }

        /* Insert user into database */
        self._app.models.user.model.build({
          firstName: datas.firstName,
          lastName: datas.lastName,
          username: datas.username,
          email: datas.email,
          password: hash
        })
        .save()
        .then(user => {
          /* Send account confirmation link */
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
                Start your Fitletics experience now by activating your account. Click on the following link <a href="http://192.168.1.26:3000/activate/${user.dataValues.activationToken}">http://192.168.1.26:3000/activate/${user.dataValues.activationToken}</a>
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

          /* OK */
          res.status(200).json({
            success: 'Congratulations, you are a Fitletics Coach subscriber. Check your emails to activate your account.'
          });
        })
        /* Database insert failed */
        .catch((error) => {
          res.status(500).json({
            error: 'Database query error'
          });
        });
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
  **    401 : User not found
  **    403 : Account not active
  **    401 : Passwords do not match
  **    500 : Password decryption failed
  **    500 : Database select failed
  *****************************************************************************/
  signin(req, res) {
    var datas = req.body;
    var self = this;

    /* Validate data format */
		joi.validate(datas, joi.object().keys({
      username: joi.string().regex(/^[a-zA-Z0-9_]{6,20}$/).required(),
			password: joi.string().min(6).required()
		}), (error, result) => {
      /* Invalid data format */
      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      /* Fetch user from database */
      this._app.models.user.model.findOne({
        where: {
          username: datas.username
        }
      })
      .then(user => {
        /* User not found */
        if (!user) {
          return res.status(401).json({
            error: 'User not found'
          });
        }
        /* Account not active */
        else if (!user.active) {
          return res.status(403).json({
            error: 'Account not active'
          });
        }

        /* Compare password */
        bcrypt.compare(datas.password, user.password)
        .then(match => {
          /* Passwords do not match */
          if (!match) {
            res.status(401).json({
              error: 'Passwords do not match'
            });
          }

          /* Create new session token */
          var token = jwt.sign({ id: user.id }, self._app.config.jsonwebtoken.secret);

          /* OK */
          res.status(200).json({
            token: token
          });
        })
        /* Password decryption failed */
        .catch(error => {
          res.status(500).json({
            error: 'Password decryption failed'
          });
        });
      })
      /* Database select error */
      .catch(error => {
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

    /* Add session token to datas */
    datas.token = req.cookies.token;

    /* Validate datas format */
    joi.validate(datas, joi.object().keys({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      username: joi.string().regex(/^[a-zA-Z0-9_]{6,20}$/).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      token: joi.string().required()
    }), (error, result) => {
      /* Invalid datas format */
      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      /* Session token decryption */
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        /* Malformed session token */
        if (error) {
          return res.status(400).json({
            error: error
          });
        }

        /* Fetch user from database */
        self._app.models.user.model.findOne({
          where: {
            id: decoded.id
          }
        })
        .then((user) => {
          /* User not found */
          if (!user) {
            return res.status(401).json({
              error: 'User not found'
            });
          }

          /* Compare passwords */
          bcrypt.compare(datas.password, user.dataValues.password)
          .then((match) => {
            /* Passwords do not match */
            if (!match) {
              res.status(401).json({
                error: 'Passwords do not match'
              });
            }

            /* Update database */
            user.update({
              firstName: datas.firstName,
              lastName: datas.lastName,
              username: datas.username,
              email: datas.email
            })
            .then((rows) => {
              res.status(200).json({
                success: 'Profile updated'
              });
            })
            .catch((error) => {
              /* Database updated failed */
              res.status(500).json({
                error: 'Database query error'
              });
            });
          })
          /* Password decryption failed */
          .catch((error) => {
            res.status(500).json({
              error: 'Password decryption failed'
            });
          });
        })
        /* Database fetch failed */
        .catch((error) => {
          res.status(500).json({
            error: 'Database query error'
          });
        });
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

    /* Add session token to datas object */
    datas.token = req.cookies.token;

    /* Validate datas format */
    joi.validate(datas, joi.object().keys({
      password: joi.string().min(6).required(),
      newPassword: joi.string().min(6).required(),
      token: joi.string().required()
    }), (error, result) => {
      /* Invalid datas format */
      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      /* Session token decryption */
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        /* Malformed session token */
        if (error) {
          return res.status(400).json({
            error: error
          });
        }

        /* Select user by id using decoded session token */
        self._app.models.user.model.findOne({
          where: {
            id: decoded.id
          }
        })
        .then(user => {
          /* User not found in database */
          if (!user) {
            return res.status(401).json({
              error: 'User not found'
            });
          }

          /* Compare passwords */
          bcrypt.compare(datas.password, user.dataValues.password)
          .then((match) => {
            /* Passwords do not match */
            if (!match) {
              res.status(401).json({
                error: 'Passwords do not match'
              });
            }

            /* Encrypt new password */
            bcrypt.hash(datas.newPassword, 10, function(error, hash) {
              /* Password encryption failed */
              if (error) {
                return res.status(500).json({
                  error: 'Password encryption failed'
                });
              }

              /* Update user password with encrypted hash */
              user.update({
                password: hash
              })
              .then((rows) => {
                res.status(200).json({
                  success: 'Password updated'
                });
              })
              .catch((error) => {
                /* Database update failed */
                res.status(500).json({
                  error: 'Database query error'
                });
              });
            });
          })
          /* Password decryption failed */
          .catch((error) => {
            res.status(500).json({
              error: 'Password decryption failed'
            });
          });
        })
        /* Database select failed */
        .catch((error) => {
          res.status(500).json({
            error: 'Database query error'
          });
        });
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

    /* Validate datas format */
		joi.validate(datas, joi.object().keys({
			token: joi.string().required()
		}), (error, result) => {
      /* Invalid datas format */
      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      /* Fetch user from database */
      self._app.models.user.model.findOne({
        active: false,
        activationToken: datas.token
      })
      .then(user => {
        /* Invalid activation token */
        if (!user) {
          return res.status(401).json({
            error: 'Invalid activation token'
          });
        } else if (user.active) {
          return res.status(401).json({
            error: 'Account already active'
          });
        }

        /* Update user in database */
        user.update({
          active: true,
  				activationToken: null
        })
        .then((rows) => {
          /* OK */
          res.status(200).json({
            success: 'Account activated'
          });
        })
        /* Database update failed */
        .catch((error) => {
          res.status(500).json({
            error: 'Database query error'
          });
        });
      })
      /* Database select failed */
      .catch((error) => {
        res.status(500).json({
          error: 'Database query error'
        });
      });
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

    /* Validate datas format */
    joi.validate(datas, joi.object().keys({
      token: joi.string().required(),
    }), (error, result) => {
      /* Invalid datas format */
      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      /* Decrypt session token */
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        /* Session token decryption failed */
        if (error) {
          return res.status(400).json({
            error: error
          });
        }

        /* Update database */
        self._app.models.user.model.update({
          active: false
        }, {
          where: {
            id: decoded.id
          }
        })
        .then(rows => {
          /* User not found or account already deactivated */
  				if (!rows[0]) {
            return res.status(401).json({
              error: 'User not found or account already deactivated'
            });
          }

          /* OK */
          res.status(200).json({
            success: 'Account deactivated'
          });
        })
        /* Database update failed */
        .catch(error => {
          res.status(500).json({
            error: 'Database query error'
          });
        });
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

    /* Validate data format */
    joi.validate(datas, joi.object().keys({
      email: joi.string().email().required(),
    }), (error, result) => {
      /* Invalid data format */
      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      /* Encrypt new password */
      bcrypt.hash(newPassword, 10, function(error, hash) {
        /* Password encryption failed */
        if (error) {
          return res.status(500).json({
            error: 'Password encryption failed'
          });
        }

        /* Update database */
        self._app.models.user.model.update({
          password: hash
        }, {
          where: {
            email: datas.email
          }
        })
        .then(rows => {
          /* User not found */
          if (!rows[0]) {
            return res.status(401).json({
              error: 'User not found'
            });
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

          /* OK */
          res.status(200).json({
            success: 'Password reset'
          });
        })
        /* Database update failed */
        .catch(error => {
          res.status(500).json({
            error: 'Database query error'
          });
        });
      });
    });
  }
}
