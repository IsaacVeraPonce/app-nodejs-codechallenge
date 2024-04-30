import fs from 'fs';
import path from 'path';

// Define the base directory as the parent directory of the current file.
const baseDir = path.resolve(__dirname, '..');
// Define the logs directory path by joining the base directory with 'logs'.
const logsDir = path.join(baseDir, 'logs');

/**
 * Converts an error object into a string.
 *
 * @param error The error object to be converted. Can be of any type.
 * @returns A string representation of the error. If the error is an object, it returns a JSON string.
 */
const errorToString = (error: any): string => {
	if (typeof error === 'object') return JSON.stringify(error, null, 2);
	else if (Array.isArray(error)) return error.join(', ');
	return String(error);
};

/**
 * Saves a log message to a file within the logs directory.
 *
 * @param logName The name of the log file (without extension).
 * @param text The text or error object to log. Can be of any type.
 */
const saveLog = ({ logName, text }: { logName: string; text: any }): void => {
	const filePath = path.join(logsDir, `${logName}.txt`);
	const errorText = errorToString(text);

	// Ensure the logs directory exists, then append or create the log file.
	fs.mkdir(logsDir, { recursive: true }, err => {
		if (err) throw err;

		fs.appendFile(filePath, `\n${errorText}`, err => {
			if (err) {
				// If appending fails, try creating the file with the log content.
				fs.writeFile(filePath, errorText, err => {
					if (err) throw err;
					console.log('Archivo de registro creado y texto agregado.');
				});
			} else {
				console.log('Texto agregado al archivo de registro.');
			}
		});
	});
};

export default saveLog;
