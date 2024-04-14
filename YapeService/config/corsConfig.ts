const NODE_ENV = process.env.NODE_ENV || 'development';
let whitelist: string[] = [];
if (NODE_ENV == 'development') whitelist = ['http://localhost:3000']; // Lista de sitios permitidos
else if (NODE_ENV == 'production') whitelist = ['https://yape.com']; // Lista de sitios permitidos

const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		if (whitelist.indexOf(origin!) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};
export default corsOptions;
