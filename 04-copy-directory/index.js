const fs = require('fs');
const path = require('path');

async function copyDir(srcDirPath, distDirName) {
  try {
    fs.mkdir(path.join(__dirname, distDirName), { recursive: true }, (err) => {
      if (err) throw err;
      console.log('Directory created successfully!');
    });

    const distDirPath = path.join(__dirname, distDirName);
    const filesCopy = await fs.promises.readdir(distDirPath);

    for (const file of filesCopy) {
      const distFilePath = path.join(__dirname, distDirName, file);

      try {
        await fs.promises.unlink(distFilePath);
        console.log('File deleted!');
      } catch {
        console.log('DELETE_ERROR');
      }
    }

    const files = await fs.promises.readdir(srcDirPath);

    for (const file of files) {
      const srcFilePath = path.join(srcDirPath, file);
      const distFilePath = path.join(__dirname, distDirName, file);

      try {
        await fs.promises.copyFile(srcFilePath, distFilePath);
        console.log('File copied!');
      } catch {
        console.log('COPY_ERROR');
      }
    }
  } catch {
    console.log('ERROR');
  }
}

copyDir(path.join(__dirname, 'files'), 'files-copy');
