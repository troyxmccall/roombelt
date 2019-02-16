const winston = require("winston");
const chalk = require("chalk");
const createContext = require("create-context");

const requestContext = createContext();

const colors = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  http: chalk.green,
  verbose: chalk.cyan,
  debug: chalk.blue,
  silly: chalk.magenta
};

const logger = winston.createLogger({
  format: winston.format.printf(info => {
    const level = colors[info.level](info.level.toUpperCase()) + " ";

    const req = requestContext.getContext();
    const path = req ? chalk.green(`[${req.baseUrl}${req.path}] `) : "";
    const requestId = (req && req.get("X-Request-Id")) ? chalk.green(`[${req.get("X-Request-Id")}] `) : "";

    return `${level}${requestId}${path}${info.message}`;
  }),
  transports: [new winston.transports.Console()]
});

module.exports = logger;

module.exports.setLogLevel = level => {
  logger.level = level;
};

module.exports.middleware = (req, res, next) => {
  requestContext.runInContext(next, req);
};