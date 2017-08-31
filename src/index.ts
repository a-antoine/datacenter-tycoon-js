require('dotenv').config();

import * as cluster from 'cluster';

import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

if (cluster.isMaster) {

	// Count the machine's CPUs
	const cpuCount = require('os').cpus().length;

	// Create a worker for each CPU
	for (let i = 0; i < cpuCount; i++) {
		cluster.fork();
	}

} else {

	const app = express();

	app.use(morgan('dev'));

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	const apiRouter = express.Router();

	require('./routes')(apiRouter);

	app.use('/api', apiRouter);

	cluster.on('exit', function(worker, code, signal) {
		console.log('Worker %d died with code/signal %s. Restarting worker...', worker.process.pid, signal || code);
		cluster.fork();
	});

	app.listen(3000, function () {
		console.log('Worker ' + cluster.worker.id + ' started');
	});
}
