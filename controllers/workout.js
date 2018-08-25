const joi = require('joi');
const { Op } = require('sequelize');

module.exports = class Workout {
  constructor(app) {
		this._app = app;
	}

  /*****************************************************************************
  ** ROUTE
  **    POST /api/workout/:id
  **
  ** DESCRIPTION
  **    Get one workout.
  **
  ** SUCCESS
  **    200 : Workout object
  **
  ** ERROR
  **    400 : Invalid data format
  **    404 : Workout not found
  **    500 : Database query error
  *****************************************************************************/
  readOne(req, res) {
    var self = this;
    var datas = req.params;

    // Validate data format
    joi.validate(datas, joi.object().keys({
      id: joi.number().integer().required(),
    }), (error, result) => {
      if (error) {
        // Invalid data format
        return res.status(400).json(error.details[0].message);
      }

      // Fetch from database
      self._app.models.workout.model.findOne({
        where: {
          id: datas.id
        },
        attributes: ['id', 'name'],
        include: [{
          model: self._app.models.round.model,
          attributes: ['id'],
          include: [{
            model: self._app.models.exercise.model,
            attributes: ['id', 'name'],
          }]
        }]
      })
      .then(workout => {
        var datas = {};

        if (!workout) {
          // Workout not found
          return res.status(404).json('Workout not found');
        }

        datas.id = workout.id;
        datas.name = workout.name;
        datas.rounds = [];

        // Loop on rounds
        for (var j = 0 ; j < workout.rounds.length ; j++) {
          datas.rounds[j] = [];

          // Loop on exercises
          for (var k = 0 ; k < workout.rounds[j].exercises.length ; k++) {
            datas.rounds[j][k] = {
              id: workout.rounds[j].exercises[k].id,
              name: workout.rounds[j].exercises[k].name,
              volume: workout.rounds[j].exercises[k].roundexercise.volume
            };
          }
        }

        // Send back workout
        res.status(200).json(datas);
      })
      // Database query error
      .catch(error => res.status(500).json(error.parent.sqlMessage));
    });
  }

  /*****************************************************************************
  ** ROUTE
  **    POST /api/workout
  **
  ** DESCRIPTION
  **    Get all workouts.
  **
  ** SUCCESS
  **    200 : Array of workouts objects
  **
  ** ERROR
  **    400 : Invalid data format
  **    404 : Workout not found
  **    500 : Database query error
  *****************************************************************************/
  readAll(req, res) {
    var self = this;

    // Fetch from database
    self._app.models.workout.model.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: self._app.models.round.model,
        attributes: ['id'],
        include: [{
          model: self._app.models.exercise.model,
          attributes: ['id', 'name'],
        }]
      }]
    })
    .then(workouts => {
      var datas = [];

      // Loop on each workout
      for (var i = 0 ; i < workouts.length ; i++) {
        var workout = workouts[i];

        datas[i] = {};
        datas[i].id = workout.id;
        datas[i].name = workout.name;
        datas[i].rounds = [];

        // Loop on rounds
        for (var j = 0 ; j < workout.rounds.length ; j++) {
          datas[i].rounds[j] = [];

          // Loop on exercises
          for (var k = 0 ; k < workout.rounds[j].exercises.length ; k++) {
            datas[i].rounds[j][k] = {
              id: workout.rounds[j].exercises[k].id,
              name: workout.rounds[j].exercises[k].name,
              volume: workout.rounds[j].exercises[k].roundexercise.volume
            };
          }
        }
      }

      // Send back workouts
      res.status(200).json(datas);
    })
    // Database query error
    .catch(error => res.status(500).json(error.parent.sqlMessage));
  }
};
