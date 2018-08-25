const joi = require('joi');
const { Op } = require('sequelize');

module.exports = class Exercise {
  constructor(app) {
		this._app = app;
	}

  /*****************************************************************************
  ** ROUTE
  **    POST /api/exercise/:id
  **
  ** DESCRIPTION
  **    Get one exercise.
  **
  ** SUCCESS
  **    200 : Exercise object
  **
  ** ERROR
  **    400 : Invalid data format
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
      self._app.models.exercise.model.findOne({
        attributes: ['id', 'name', 'points'],
        where: {
          id: datas.id
        }
      })
      // Send back exercise
      .then(exercise => res.status(200).json(exercise))
      // Database query error
      .catch(error => res.status(500).json(error.parent.sqlMessage));
    });
  }

  /*****************************************************************************
  ** ROUTE
  **    POST /api/exercise
  **
  ** DESCRIPTION
  **    Get all exercises.
  **
  ** SUCCESS
  **    200 : Array of exercises objects
  **
  ** ERROR
  **    500 : Database query error
  *****************************************************************************/
  readAll(req, res) {
    var self = this;

    // Fetch from database
    self._app.models.exercise.model.findAll({
      attributes: ['id', 'name', 'points']
    })
    // Send back exercises
    .then(exercises => res.status(200).json(exercises))
    // Database query error
    .catch(error => res.status(500).json(error.parent.sqlMessage));
  }
};
