import cluster from 'cluster';
import express, { Express, Request, Response } from 'express';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';

import corsOptions from './config/corsConfig';
import limiterConfig from './config/rateLimit';
import graphqlMiddleware from './config/graphql';
import saveLog from './helpers/logs';

dotenv.config();

const timeout = require('connect-timeout');
const cors = require('cors');
const numCPUs = os.cpus().length;
let instances: number = 0;

const startMasterCluster = () => {
	console.log(__filename, `Master ${process.pid} is running`);
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
		instances++;
	}
	console.log(__filename, 'INSTANCES', instances);

	cluster.on('exit', (worker, code, signal) => {
		console.log(__filename, `Worker ${worker.process.pid} died`);
	});
	saveLog({ logName: 'index', text: 'START SERVER' });
};

const startWorkerProcess = () => {
	console.log(__filename, `Worker ${process.pid} started`);

	process.on('warning', warning => {
		console.warn(warning.name); // Print the warning name
		console.warn(warning.message); // Print the warning message
		console.warn(warning.stack); // Print the stack trace
	});

	process.on('uncaughtException', async err => {
		saveLog({ logName: 'index', text: err });
	});

	process.on('SIGINT', () => process.exit());

	const port = process.env.PORT || 3000;
	const app: Express = express();

	// Apply middleware
	app.use(limiterConfig);
	app.use(timeout('30s'));
	app.use(cors(corsOptions));
	app.use('/graphql', graphqlMiddleware);

	// Serve index.html
	app.get('/', (req: Request, res: Response) => {
		res.sendFile(path.join(__dirname, 'views', 'index.html'));
	});

	app.listen(port, () => {
		console.log(`[server]: Server is running at http://localhost:${port}`);
	});
};

if (cluster.isPrimary) startMasterCluster();
else startWorkerProcess();
