const fs = require('fs');
const path = require('path');

module.exports = class Models {
	constructor(app) {
		var models = fs.readdirSync(__dirname).filter(file => path.parse(__filename).name !== path.parse(file).name).map(file => path.parse(file).name);

		for (let i = 0 ; i < models.length ; i++) {
			let model = require('./' + models[i]);

			this[models[i]] = new model(app);
		}
	}
}
