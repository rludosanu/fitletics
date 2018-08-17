const joi = require('joi');
const { Op } = require('sequelize');

module.exports = class User {
	/* Default */
  constructor(app) {
		this._app = app;
	}

	/* Create */
	create(req, res) {
    var datas = req.body;
    var self = this;

    joi.validate(datas, joi.object().keys({
    	// datas
    }), (error, result) => {
      if (error) {
        return res.status(400).json({
        	error: error.details[0].message
        });
      }

      self._app.models.example.model.build({
				// datas
      })
      .save()
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
		});
	}

	/* Read */
	read(req, res) {
    var datas = req.body;
    var self = this;

		/* Code goes here */
	}

	/* Update */
	update(req, res) {
    var datas = req.body;
    var self = this;

		/* Code goes here */
	}

	/* Destoy */
	destroy(req, res) {
    var datas = req.body;
    var self = this;

		/* Code goes here */
	}
}
