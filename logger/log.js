const winston = require('winston');
const DailyRotateFile = require ('winston-daily-rotate-file');
const {createLogger,format,transports}= winston;

const customFormat = format.printf(({ level, message, timestamp }) => {
  return ` [${level.toUpperCase()}]:${timestamp} :\n ${message} `;
});

const logger = createLogger({
    level: 'info', // Setting default log level
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      //format.json()
      //format.simple()
      customFormat
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(), 
          format.simple() //for simple format
        ),
      }),
      
      new DailyRotateFile({
        filename: `logger/Logs/Info/%DATE%.log`,
        datePattern: 'YYYY-MM-DD', // Rotate daily,
        format:'',
        zippedArchive: true, // Compress rotated files
        maxSize: '20m', // Max size of a single file
        maxFiles: '14d', // Retain logs for 14 days
        level: 'info', // Log level for this transport
      }),

      new DailyRotateFile({
        filename: `logger/Logs/Error/%DATE%.log`,
        datePattern: 'YYYY-MM-DD', // Rotate daily
        zippedArchive: true, // Compress rotated files
        maxSize: '20m', // Max size of a single file
        maxFiles: '14d', // Retain logs for 14 days
        level: 'error', // Log level for this transport
      }),
    ],
  });
  
  module.exports = logger;