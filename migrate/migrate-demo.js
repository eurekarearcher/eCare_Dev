//command: npm run migrate:demo

const fs = require('fs');
const ncp = require('ncp').ncp;
const rimraf = require('rimraf');
const path = require('path');

// SOURCE AND DESTINATION DIRECTORIES
const source_folder = path.join(__dirname, '..', 'dist', 'demo');
const dest_folder = 'C:/Users/EureKare/Desktop/TestQA/SynologyDrive/dist';

// FUNCTION TO CLEAR THE DESTINATION FOLDER
function clearDestinationFolder(dest) {
  if (fs.existsSync(dest)) {
    rimraf.sync(dest);  // USE RIMRAF TO DELETE THE FOLDER AND ITS CONTENTS
    console.log('DESTINATION FOLDER CLEARED!');
  }
}

// ENSURE DESTINATION FOLDER IS EMPTY BEFORE COPYING
clearDestinationFolder(dest_folder);

// CREATE DESTINATION FOLDER (AFTER CLEARING)
fs.mkdirSync(dest_folder, { recursive: true });

// EXCLUDE 'NODE_MODULES' AND 'SYNOWORKINGDIRECTORY' FOLDER
ncp.limit = 16;  // OPTIONAL: CONTROL THE NUMBER OF CONCURRENT FILE COPIES

ncp(source_folder, dest_folder, {
  filter: (source) => {
    return !source.includes('node_modules') && !source.includes('SynologyWorkingDirectory'); // EXCLUDE THESE FOLDERS
  }
}, function (err) {
  if (err) {
    return console.error('ERROR COPYING FILES:', err);
  }
  console.log('FILES COPIED SUCCESSFULLY, EXCLUDING NODE_MODULES AND SYNOWORKINGDIRECTORY!: ');
});
