const joi = require('joi');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

module.exports = class Training {
  constructor(app) {
		this._app = app;
	}

  /*****************************************************************************
  ** ROUTE
  **    POST /api/training/create
  **
  ** DESCRIPTION
  **    Create a new training
  **
  ** SUCCESS
  **    200 : Training created
  **
  ** ERROR
  **    400 : Invalid data format
  **    404 : Workout not found
  **    404 : Exercise not found
  **    500 : Database query error
  *****************************************************************************/
  create(req, res) {
    var self = this;
    var datas = req.body;

    // Add session token to datas
    datas.token = req.cookies.token;

    // Validate data format
    joi.validate(datas, joi.object().keys({
      token: joi.string().required(),
      workoutId: joi.number().integer(),
      exerciseId: joi.number().integer(),
      volume: joi.number().integer().required(),
    }).or('workoutId', 'exerciseId'), (error, result) => {
      if (error) {
        // Invalid data format
        return res.status(400).json(error.details[0].message);
      }

      // Decrypt session token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // Decryption error
          return res.status(400).json(error);
        }

        // Fetch workout
        if (datas.workoutId) {
          // Fetch from database
          self._app.models.workout.model.findOne({
            where: {
              id: datas.workoutId
            }
          })
          .then(workout => {
            if (!workout) {
              // Workout not found
              return res.status(404).json('Workout not found');
            }

            // Insert into database
            self._app.models.training.model.create({
              userId: decoded.id,
              volume: datas.volume
            })
            .then(training => {
              var id = training.dataValues.id;

              // Associate workout to training
              training.addWorkouts(workout)
              .then(training => {
                // OK
                res.status(200).json(id);
              })
              // Database query error
              .catch(error => {
                console.error(error);
                res.status(500).json(error)
              });
            })
            // Database query error
            .catch(error => {
              console.error(error);
              res.status(500).json(error)
            });
          })
          // Database query error
          .catch(error => {
            console.error(error);
            res.status(500).json(error)
          });
        }
        // Fetch exercise
        else if (datas.exerciseId) {
          // Fetch from database
          self._app.models.exercise.model.findOne({
            where: {
              id: datas.exerciseId
            }
          })
          .then(exercise => {
            // Exercise not found
            if (!exercise) {
              return res.status(404).json('Exercise not found');
            }

            // Insert into database
            self._app.models.training.model.create({
              userId: decoded.id,
              volume: datas.volume
            })
            .then(training => {
              var id = training.dataValues.id;

              // Associate exercise to training
              training.addExercises(exercise)
              .then(training => {
                // OK
                res.status(200).json(id);
              })
              // Database query error
              .catch(error => {
                console.error(error);
                res.status(500).json(error)
              });
            })
            // Database query error
            .catch(error => {
              console.error(error);
              res.status(500).json(error)
            });
          })
          // Database query error
          .catch(error => {
            console.error(error);
            res.status(500).json(error)
          });
        }
        else {
          // Nothing to fetch
          res.status(500).json('Invalid training type');
        }
      });
    });
  }

  /*****************************************************************************
  ** ROUTE
  **    PUT /api/training/start
  **
  ** DESCRIPTION
  **    Start a training.
  **
  ** SUCCESS
  **    200 OK: Success
  **
  ** ERROR
  **    304 Not Modified: Training not modified
  **    400 Bad Request: Invalid datas
  **    404 Not Found: Training not found
  **    500 Internal Server Error: Session token decryption error
  **    500 Internal Server Error: Database query error
  *****************************************************************************/
  start(req, res) {
    var self = this;
    var datas = req.body;
    var currentDate = new Date();

    currentDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    // Add session token to datas
    datas.token = req.cookies.token;

    // Validate datas
    joi.validate(datas, joi.object().keys({
      token: joi.string().required(),
      trainingId: joi.number().integer(),
    }), (error, result) => {
      if (error) {
        // 400 Bad Request: Invalid datas
        return res.status(400).json(error.details[0].message);
      }

      // Decrypt session token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // 500 Internal Server Error: Session token decryption error
          return res.status(500).json(error);
        }

        // Find training
        self._app.models.training.model.findOne({
          where: {
            id: datas.trainingId
          }
        })
        .then(training => {
          if (!training) {
            // 404 Not Found: Training not found
            return res.status(404).json('Training not found');
          }
          training.update({
            startedAt: currentDate
          })
          .then(training => {
            if (!Object.keys(training._changed).length) {
              // 304 Not Modified: Training not modified
              return res.status(304).json();
            }

            res.status(200).json('Training started');
          })
          .catch(error => {
            console.error(error);
            res.status(500).json(error)
          });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json(error)
        });
      });
    });
  }

  /*****************************************************************************
  ** ROUTE
  **    PUT /api/training/finish
  **
  ** DESCRIPTION
  **    Finish a training.
  **
  ** SUCCESS
  **    200 OK: Success
  **
  ** ERROR
  **    304 Not Modified: Training not modified
  **    400 Bad Request: Invalid datas
  **    404 Not Found: Training not found
  **    500 Internal Server Error: Session token decryption error
  **    500 Internal Server Error: Database query error
  *****************************************************************************/
  finish(req, res) {
    var self = this;
    var datas = req.body;
    var currentDate = new Date();

    currentDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    // Add session token to datas
    datas.token = req.cookies.token;

    // Validate datas
    joi.validate(datas, joi.object().keys({
      token: joi.string().required(),
      trainingId: joi.number().integer(),
    }), (error, result) => {
      if (error) {
        // 400 Bad Request: Invalid datas
        return res.status(400).json(error.details[0].message);
      }

      // Decrypt session token
      jwt.verify(datas.token, self._app.config.jsonwebtoken.secret, (error, decoded) => {
        if (error) {
          // 500 Internal Server Error: Session token decryption error
          return res.status(500).json(error);
        }

        // Find training
        self._app.models.training.model.findOne({
          where: {
            id: datas.trainingId
          }
        })
        .then(training => {
          if (!training) {
            // 404 Not Found: Training not found
            return res.status(404).json('Training not found');
          }
          training.update({
            finishedAt: currentDate
          })
          .then(training => {
            if (!Object.keys(training._changed).length) {
              // 304 Not Modified: Training not modified
              return res.status(304).json();
            }

            res.status(200).json('Training finished');
          })
          .catch(error => {
            console.error(error);
            res.status(500).json(error)
          });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json(error)
        });
      });
    });
  }

  /*****************************************************************************
  ** ROUTE
  **    POST /api/training/read
  **
  ** DESCRIPTION
  **    Get all trainings
  **
  ** SUCCESS
  **    200 : List of trainings objects
  **
  ** ERROR
  **    400 : Invalid data format
  **    404 : Workout not found
  **    404 : Exercise not found
  **    500 : Database query error
  *****************************************************************************/
  read(req, res) {
    var self = this;
    var datas = req.cookies;

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
          // Decryption error
          return res.status(400).json(error);
        }

        // Fetch from database
        self._app.models.training.model.findAll({
          where: {
            userId: decoded.id,
            startedAt: {
              [Op.ne]: null
            },
            finishedAt: {
              [Op.ne]: null
            },
          },
          order: [
            ['createdAt', 'DESC']
          ],
          include: [{
            model: self._app.models.exercise.model,
            attributes: ['id', 'name', 'points']
          }, {
            model: self._app.models.workout.model,
            attributes: ['id', 'name']
          }]
        })
        .then(results => {
          var trainings = [];

          for (var i = 0 ; i < results.length ; i++) {
            var tmp = results[i].dataValues;
            var calculateDuration = function(date1, date2) {
              var microseconds = date2 - date1;
              var seconds = Math.floor(microseconds / 1000);
              var minutes = Math.floor(seconds / 60);
              var hours = Math.floor(minutes / 60);
              var secondsText = '', minutesText = '', hoursText = '';

              seconds %= 60;
              minutes %= 60;
              hours %= 24;
              secondsText = (seconds < 10) ? '0' + seconds : seconds;
              minutesText = (minutes < 10) ? '0' + minutes : minutes;
              hoursText = (hours < 10) ? '0' + hours : hours;

              return (hours) ? `${hoursText}:${minutesText}:${secondsText}` : `${minutesText}:${secondsText}`;
            }
            var calculateInterval = function(date1) {
              var date2 = Date.now();
              var microseconds = date2 - date1;
              var days = Math.floor(microseconds / (24 * 60 * 60 * 1000));

              if (days == 0) {
                return 'Today';
              } else if (days == 1) {
                return 'Yesterday';
              } else {
                return days + ' days ago';
              }
            }

            trainings.push({
              id: (tmp.exercises.length) ? tmp.exercises[0].id : tmp.workouts[0].id,
              date: calculateInterval(new Date(tmp.createdAt)),
              duration: calculateDuration(new Date(tmp.startedAt), new Date(tmp.finishedAt)),
              volume: tmp.volume,
              type: (tmp.exercises.length) ? 'exercise' : 'workout',
              name: (tmp.exercises.length) ? tmp.exercises[0].name : tmp.workouts[0].name
            });
          }

          res.status(200).json(trainings);
        })
        // Database query error
        .catch(error => {
          console.error(error);
          res.status(500).json(error)
        });
      });
    });
  }
};
