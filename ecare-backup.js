const fs = require('fs');
const ncp = require('ncp').ncp;
const rimraf = require('rimraf');

const version = process.env.npm_package_version || 'v1.0.0';

// Source and destination directories
const source_folder = __dirname;
const dest_folder = [
  `C:/Users/EureKare/Desktop/Eurekare/Backup/dev/eCare_Dev/Version/${version}`,
  `C:/Users/EureKare/Desktop/eCare_Dev Backup/SynologyDrive/eCare_Dev v4/Version/${version}`
];

dest_folder.forEach(el => {
  // FUNCTION TO CLEAR THE DESTINATION FOLDER
  function clearDestinationFolder(dest) {
    if (fs.existsSync(dest)) {
      rimraf.sync(dest);  // USE RIMRAF TO DELETE THE FOLDER AND ITS CONTENTS
      console.log('DESTINATION FOLDER CLEARED!');
    }
  }
  
  // ENSURE DESTINATION FOLDER IS EMPTY BEFORE COPYING
  clearDestinationFolder(el);
  
  // CREATE DESTINATION FOLDER (AFTER CLEARING)
  fs.mkdirSync(el, { recursive: true });
  
  // Exclude 'node_modules' folder by checking it during the copy process
  ncp.limit = 16; // Optional: control the number of concurrent file copies
  
  ncp(source_folder, el, {
    filter: (source) => {
      return !source.includes('node_modules') && !source.includes('SynologyWorkingDirectory'); // Exclude the 'node_modules' folder
    }
  }, function (err) {
    if (err) {
      return console.error('Error copying files:', err);
    }
    console.log(`Files copied successfully, excluding node_modules!: folder ${el}`);
  });
})
