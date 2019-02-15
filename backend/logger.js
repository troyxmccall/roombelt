const winston = require("winston");
const chalk = require("chalk");
const config = require("./config");

const colors = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  http: chalk.green,
  verbose: chalk.cyan,
  debug: chalk.blue,
  silly: chalk.magenta
};

winston.configure({
  level: config.logLevel,
  format: winston.format.printf(info => {
    const level = colors[info.level](info.level.toUpperCase()) + " ";
    const path = info.req ? chalk.green(`[${info.req.baseUrl}${info.req.path}] `) : "";
    const ip = (info.req && info.req.get("X-Forwarded-For")) ? chalk.green(`[${info.req.get("X-Forwarded-For")}] `) : "";

    return `${level}${path}${ip}${info.message}`;
  }),
  transports: [new winston.transports.Console()]
});