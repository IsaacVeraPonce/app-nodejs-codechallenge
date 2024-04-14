import express, { Express, Request, Response } from 'express';
import path from 'path';
const timeout = require('connect-timeout');
const cors = require('cors');
import corsOptions from './config/corsConfig';
import limiterConfig from './config/rateLimit';
import graphqlMiddleware from './config/graphql';
import dotenv from 'dotenv';
process.on('SIGINT', () => process.exit());
dotenv.config();
const port = process.env.PORT || 3000;
const app: Express = express();

// Aplica el limitador a todas las rutas
app.use(limiterConfig);
app.use(timeout('30s'));
app.use(cors(corsOptions));
app.use('/graphql', graphqlMiddleware);
app.get('/', (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
