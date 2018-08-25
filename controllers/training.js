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
              // Associate workout to training
              training.addWorkouts(workout)
              .then(training => {
                // OK
                res.status(200).json('Training created');
              })
              // Database query error
              .catch(error => res.status(500).json(error.parent.sqlMessage));
            })
            // Database query error
            .catch(error => res.status(500).json(error.parent.sqlMessage));
          })
          // Database query error
          .catch(error => res.status(500).json(error.parent.sqlMessage));
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
              // Associate exercise to training
              training.addExercises(exercise)
              .then(training => {
                // OK
                res.status(200).json('Training created');
              })
              // Database query error
              .catch(error => res.status(500).json(error.parent.sqlMessage));
            })
            // Database query error
            .catch(error => res.status(500).json(error.parent.sqlMessage));
          })
          // Database query error
          .catch(error => res.status(500).json(error.parent.sqlMessage));
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
            userId: decoded.id
          },
          order: [
            ['createdAt', 'DESC']
          ],
          include: [{
            model: self._app.models.exercise.model,
            attributes: ['id', 'name']
          }, {
            model: self._app.models.workout.model,
            attributes: ['id', 'name']
          }]
        })
        .then(results => {
          var trainings = [];

          for (var i = 0 ; i < results.length ; i++) {
            var training = {};
            var tmp = results[i].dataValues;
            var date = new Date(tmp.createdAt);

            training.id = (tmp.exercises.length) ? tmp.exercises[0].id : tmp.workouts[0].id;
            training.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
            training.volume = tmp.volume;
            training.type = (tmp.exercises.length) ? 'exercise' : 'workout';
            training.name = (tmp.exercises.length) ? tmp.exercises[0].name : tmp.workouts[0].name;

            trainings.push(training);
          }

          res.status(200).json(trainings);
        })
        // Database query error
        .catch(error => res.status(500).json(error.parent.sqlMessage));
      });
    });
  }
};
