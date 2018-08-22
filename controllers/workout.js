const joi = require('joi');
const { Op } = require('sequelize');

module.exports = class Workout {
	/*
  ** Default
  */
  constructor(app) {
		this._app = app;
	}

  /*
  ** readOne
  **    Return one workout based on its id.
  */
  readOne(req, res) {
    var self = this;
    var datas = req.params;

    // Validate data format
    joi.validate(datas, joi.object().keys({
      id: joi.number().integer().required(),
    }), (error, result) => {
      // Invalid data format
      if (error) {
        console.error(error);
        return res.status(400).json({
          error: error.details[0].message
        });
      }

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
          return res.status(404).json({ error: 'Workout not found' });
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

        res.status(200).json(datas);
      })
      .catch(error => res.status(500).json(error));
    });
  }

  /*
  ** readAll
  **    Returns all of the workouts.
  */
  readAll(req, res) {
    var self = this;

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

      res.status(200).json(datas);
    })
    .catch(error => res.status(500).json(error));
  }
};
