import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Define __dirname manually (ES module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the logs directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format: [date time] [log level] [function] - Log statement
const logFormat = winston.format.printf(({ level, timestamp, functionName, message }) => {
  return `[${timestamp}] [${level.toUpperCase()}] [${functionName}] - ${message}`;
});

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "app.txt"), level: "info" }),
    new winston.transports.File({ filename: path.join(logDir, "errors.txt"), level: "error" }),
    new winston.transports.Console(),
  ],
});

// Function to log general messages
export const logMessage = (level, functionName, message) => {
  logger.log({ level, functionName, message });
};

// Function to log errors (Format as a single-line log)
export const logError = (functionName, error) => {
  const errorMessage = `${error.message} | At: ${error.stack.split("\n")[1].trim()}`;
  logger.log({ level: "error", functionName, message: errorMessage });
};
