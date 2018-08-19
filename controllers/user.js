const joi = require('joi');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
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
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Encrypt password
      bcrypt.hash(datas.password, 10, function(error, hash) {
        // Password encryption error
        if (error) {
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
        .then((result) => {
          // Send the account confirmation link
          nodemailer.createTransport(self._app.config.mail).sendMail({
          	from: 'Fitletics Coach<fitleticscoach@gmail.com>',
          	to: datas.email,
          	subject: 'Welcome to Fitletics Coach',
          	html: `
          	<div style="color: #444444; font-size: 15px; margin: 45px 0px;">
          		<div style="font-size: 22px; margin-bottom: 25px;">
                Hi ${datas.firstName} !
              </div>
              <div style="margin-bottom: 20px;">
                Congratulations, you are a Fitletics Coach subscriber. You have decided to lead a healthier and happier life. Bravo.
              </div>
              <div style="margin-bottom: 20px;">
                Lead a new way of life, both mentally and physically. Start your Fitletics experience now.
              </div>
              <div style="margin-bottom: 20px;">
                To activate your account please click the following link <a href="http://127.0.0.1:3000/activate/${result.dataValues.activationToken}">http://127.0.0.1:3000/activate/${result.dataValues.activationToken}</a>.
              </div>
              <div style="margin-bottom: 20px;">
                Do you have any questions or comments ? Sends us an email at fitleticscoach@gmail.com. A member of our team will take care of you as soon as possible.
              </div>
          		<div>
                Have fun and become the best version of yourself,
                <br />
                <strong>Fitletics Team</strong>
              </div>
          	</div>
          	`
          });

          // Return a success message
          res.status(200).json({
            message: 'User account created'
          });
        })
        .catch((error) => res.status(500).json({
          error: error.parent
        }));
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
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Match user email in database
      this._app.models.user.model.findOne({
        where: {
          email: datas.email
        }
      })
      .then((user) => {
        // Email not found
        if (!user) {
          return res.status(401).json({
            error: 'User account not found'
          });
        }
        // Account not activated
        else if (!user.active) {
          return res.status(403).json({
            error: 'User account not active'
          });
        }

        // Compare password
        bcrypt.compare(datas.password, user.password)
        .then((match) => {
          // Passwords not matching
          if (!match) {
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
        .catch((error) => res.status(500).json(error));
      })
      .catch((error) => res.status(500).json(error));
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
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Decrypt json web token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        // Token not decrypted
        if (error) {
          return res.status(400).json({
            error: error
          });
        }

        // Read from database
        this._app.models.user.model.findOne({
          attributes: ['firstName', 'lastName', 'username', 'email'],
          where: {
            id: decoded.id
          }
        })
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json(error));
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
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Decrypt json web token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        // Token not decrypted
        if (error) {
          return res.status(400).json({
            error: error
          });
        }

        // Update database entry
        this._app.models.user.model.update({
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
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json(error));
      });
    });
	}

  /*
	** Activate
	**   Activate user account by setting user "active" column to TRUE.
	*/
	activate(req, res) {
    var datas = req.cookies;
    var self = this;

    // Validate datas format
		joi.validate(datas, joi.object().keys({
			token: joi.string().required()
		}), (error, result) => {
      // Invalid datas format
      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Update database entry
      this._app.models.user.model.update({
				active: true,
				activationToken: null
			}, {
				where: {
					active: false,
					activationToken: datas.token
				}
			})
			.then((result) => {
        // Token not found
				if (!result[0]) {
          return res.status(401).json({
            error: 'Invalid activation token'
          });
        }
        // Account already activated
        else if (result[0].active) {
          return res.status(400).json({
            error: 'User account already active'
          });
        }

        res.status(200).json({
          message: 'User account activated'
        });
			})
      .catch(error => res.status(500).json({
        error: error.parent
      }));
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
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      // Decrypt json web token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        // Token not decrypted
        if (error) {
          return res.status(400).json({
            error: error
          });
        }

        // Update database entry
        this._app.models.user.model.update({
          active: false
        },
        {
          where: {
            id: decoded.id
          }
        })
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json(error));
      });
    });
	}
}
