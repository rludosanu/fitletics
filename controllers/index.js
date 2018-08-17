const fs = require('fs');
const path = require('path');

module.exports = class Controllers {
	constructor(app) {
		var controllers = fs.readdirSync(__dirname).filter(file => path.parse(__filename).name !== path.parse(file).name).map(file => path.parse(file).name);

		for (let i = 0 ; i < controllers.length ; i++) {
			let controller = require('./' + controllers[i]);

			console.log(controllers[i]);

			this[controllers[i]] = new controller(app);
		}
	}
}
