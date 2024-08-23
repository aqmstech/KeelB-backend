#! /usr/bin/env node 
let UtilsService = require('./utils');

if (process.argv.length < 4) {
  UtilsService.showHelp();
} else {
  const user_option = process.argv[2];
  switch (user_option) {
    case "add":
      console.log("------------ Creating Module ", process.argv[3], '----------------');
      UtilsService.generateModule(process.argv[3], process.argv[4] ? process.argv[4] : 'ts', process.argv[5]);
      break;
    case "remove":
      console.log("------------ Removing Module ", process.argv[3], '----------------');
      UtilsService.removeModule(process.argv[3], process.argv[4] ? process.argv[4] : 'ts');
      break;
    default:
      UtilsService.showHelp();

  }
}

