const { dir } = require('console');
const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Directory created successfully!');
  copyDir(path.join(__dirname, 'files'), 'files-copy');
});

function copyDir(srcDirPath, distDirName) {
  fs.promises.readdir(srcDirPath).then((data) =>
    data.forEach((file) => {
      fs.copyFile(
        path.join(srcDirPath, file),
        path.join(__dirname, distDirName, file),
        (err) => {
          if (err) throw err;
          console.log(`File ${file} copied successfully!`);
        },
      );
    }),
  );
}
