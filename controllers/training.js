const joi = require('joi');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

module.exports = class Training {
	/*
  ** Default
  */
  constructor(app) {
		this._app = app;
	}

  /*
  ** create
  **    Create a new training.
  */
  create(req, res) {
    var self = this;
    var datas = req.body;

    // Save token
    datas.token = req.cookies.token;

    // Validate data format
    joi.validate(datas, joi.object().keys({
      token: joi.string().required(),
      workoutId: joi.number().integer(),
      exerciseId: joi.number().integer(),
      volume: joi.number().integer().required(),
    }).or('workoutId', 'exerciseId'), (error, result) => {
      // Invalid data format
      if (error) {
        console.error(error);
        return res.status(400).json({ error: error.details[0].message });
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

        // Workout id is set
        if (datas.workoutId) {
          // Fetch the workout
          self._app.models.workout.model.findOne({
            where: {
              id: datas.workoutId
            }
          })
          .then(workout => {
            // Workout not found
            if (!workout) {
              return res.status(404).json({ error: 'Workout not found' });
            }

            // Create a new training entry
            self._app.models.training.model.create({
              userId: decoded.id,
              volume: datas.volume
            })
            .then(training => {
              // Associate workout to training
              training.addWorkouts(workout)
              .then(training => {
                res.status(200).json({ success: 'Training saved' });
              })
              .catch(error => res.status(500).json({ error: error.parent }));
            })
            .catch(error => res.status(500).json({ error: error.parent }));
          })
          .catch(error => res.status(500).json({ error: error.parent }));
        }
        // Exercise id is set
        else if (datas.exerciseId) {
          // Fetch the exercise
          self._app.models.exercise.model.findOne({
            where: {
              id: datas.exerciseId
            }
          })
          .then(exercise => {
            // Exercise not found
            if (!exercise) {
              return res.status(404).json({ error: 'Exercise not found' });
            }

            // Create a new training entry
            self._app.models.training.model.create({
              userId: decoded.id,
              volume: datas.volume
            })
            .then(training => {
              // Associate exercise to training
              training.addExercises(exercise)
              .then(training => {
                res.status(200).json({ success: 'Training saved' });
              })
              .catch(error => res.status(500).json({ error: error.parent }));
            })
            .catch(error => res.status(500).json({ error: error.parent }));
          })
          .catch(error => res.status(500).json({ error: error.parent }));
        }
        // Exercise id and workout id not set
        else {
          res.status(500).json({ error: 'Invalid workout or exercise id' });
        }
      });
    });
  }



  /*
  ** read
  **    Get all user's trainings
  */
  read(req, res) {
    var self = this;
    var datas = req.cookies;

    // Validate data format
    joi.validate(datas, joi.object().keys({
      token: joi.string().required(),
    }), (error, result) => {
      // Invalid data format
      if (error) {
        console.error(error);
        return res.status(400).json({ error: error.details[0].message });
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
        .catch(error => {
          res.status(500).json({ error: 'Database query error' });
        });
      });
    });
  }
};
