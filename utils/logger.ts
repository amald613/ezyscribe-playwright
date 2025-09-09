import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// Logger instance
export const logger = createLogger({
  level: "info", // default logging level
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(), // adds colors for console logs
    logFormat
  ),
  transports: [
    new transports.Console(), // log to console
    new transports.File({ filename: "logs/execution.log" }) // log to file
  ],
});

// Shortcut functions
export const logInfo = (msg: string) => logger.info(msg);
export const logWarn = (msg: string) => logger.warn(msg);
export const logError = (msg: string) => logger.error(msg);
