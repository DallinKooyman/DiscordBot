
const { Console } = require('console');
const fs = require('fs');
const output = fs.WriteStream("Logs/output.log", {flags: 'a'});
const errorOutput = fs.WriteStream("Logs/error.log", {flags: 'a'});
const date = new Date();

const logger = new Console({ stdout: output, stderr: errorOutput });

/**
 * This function grabs the current time prior to logging the msg in the log files
 * Some methods have more added to account for when there would only be one digit
 * in the number, (ex minute 7 of an hour, 3rd day of a month)
 * This gets all the information in its own variable before combining them all in a 
 * return statement.
 * @returns current time stamp give in YYYY-MM-DD hh:mm:ss format
 */
function getCurrentMoment(){

  let year = date.getFullYear();

  // (Jan is 0, Dec is 11 so 1 is added)
  let month = ("0" + (date.getMonth() + 1)).slice(-2);

  let day = ("0" + date.getDate()).slice(-2);
  
  let hours = ("0" + date.getHours()).slice(-2);
  
  let minutes = ("0" + date.getMinutes()).slice(-2);

  let seconds = ("0" + date.getSeconds()).slice(-2);
  
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + " ";
}

module.exports.log = function (msg) {
  let time = getCurrentMoment();
  logger.log(time + msg);
};

module.exports.error = function (msg) { 
  let time = getCurrentMoment();
  logger.error(time + msg);
};


