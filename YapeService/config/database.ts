const pg = require('knex')({
	client: 'pg',
	connection: {
		host: process.env.DB_HOST || '127.0.0.1',
		port: parseInt(process.env.DB_PORT || '5432'),
		user: process.env.DB_USER || 'postgres',
		password: process.env.DB_PASSWORD || 'postgres',
		database: process.env.yape || 'yape',
		ssl: false,
	},
	pool: { min: 0, max: 1000 },
});

export default pg;
