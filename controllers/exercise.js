const joi = require('joi');
const { Op } = require('sequelize');

module.exports = class Exercise {
	/*
  ** Default
  */
  constructor(app) {
		this._app = app;
	}

  /*
  ** readOne
  **    Return one exercise based on its id.
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

      self._app.models.exercise.model.findOne({
        where: {
          id: datas.id
        },
        attributes: ['id', 'name', 'points'],
      })
      .then(exercise => {
        res.status(200).json(exercise);
      })
      .catch(error => res.status(500).json(error));
    });
  }

  /*
  ** readAll
  **    Returns all of the exercises.
  */
  readAll(req, res) {
    var self = this;

    self._app.models.exercise.model.findAll({
      attributes: ['id', 'name', 'points'],
    })
    .then(exercises => {
      res.status(200).json(exercises);
    })
    .catch(error => res.status(500).json(error));
  }
};
