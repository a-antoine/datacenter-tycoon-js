import { Application, Request, Response, NextFunction } from 'express';

import playerRouter = require('./player');

export = function (app: Application) {

	app.get('/', function (req: Request, res: Response) {
		res.send('Hello World!');
	});

	app.use(function(req: Request, res: Response, next: NextFunction) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		next();
	});

	app.use('/player', playerRouter);
};