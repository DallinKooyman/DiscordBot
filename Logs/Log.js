
const { Console } = require('console');
const fs = require('fs');
const output = fs.WriteStream("Logs/output.log", {flags: 'a'});
const errorOutput = fs.WriteStream("Logs/error.log", {flags: 'a'});
const date = new Date();

const logger = new Console({ stdout: output, stderr: errorOutput });

function getCurrentMoment(){

  // current date
  // adjust 0 before single digit date
  let day = ("0" + date.getDate()).slice(-2);
  
  // current month
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  
  // current year
  let year = date.getFullYear();
  
  // current hours
  let hours = date.getHours();
  
  // current minutes
  let minutes = date.getMinutes();
  
  // current seconds
  let seconds = ("0" + (date.getSeconds() + 1)).slice(-2);
  
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


