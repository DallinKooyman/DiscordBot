
const { Console } = require('console');
const fs = require('fs');
const output = fs.WriteStream("Logs/output.log");
const errorOutput = fs.WriteStream("Logs/error.log");

const logger = new Console({ stdout: output, stderr: errorOutput });

module.exports.log = function (msg) {
  logger.log(msg);
};

module.exports.error = function (msg) { 
  logger.error(msg);
};


