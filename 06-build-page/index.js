const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

async function createDir(dirName, parentDir) {
  try {
    await fs.promises.mkdir(path.join(parentDir, dirName));
    console.log(`${dirName} directory created!`);
  } catch {
    console.log(`${dirName} directory creation failed!`);
  }
}

function fillHTML() {
  const readDist = fs.createReadStream(path.join(__dirname, 'template.html'));
  readDist.on('data', async (data) => {
    let stringTemp = data.toString();
    const compDirPath = path.join(__dirname, 'components');

    try {
      const compData = await fs.promises.readdir(compDirPath);

      const compPromises = compData.map(async (file) => {
        const readComp = await fs.promises.readFile(
          path.join(compDirPath, file),
        );
        const compName = path.basename(file, path.extname(file));
        const stringComp = readComp.toString();
        stringTemp = stringTemp.replace(`{{${compName}}}`, stringComp);
      });

      await Promise.all(compPromises);

      const writeDist = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'index.html'),
      );
      writeDist.write(stringTemp);
    } catch {
      console.log('ERROR');
    }
  });
}

async function fillCSS() {
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'));
  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
  );
  await Promise.all(
    files.map(async (file) => {
      if (path.extname(file) === '.css') {
        const readStream = fs.createReadStream(
          path.join(__dirname, 'styles', file),
        );
        await pipeline(readStream, writeStream, { end: false });
      }
    }),
  );

  writeStream.end();
}

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
        if ((await fs.promises.stat(srcFilePath)).isDirectory()) {
          copyDir(srcFilePath, path.join(distDirName, file));
        }
        await fs.promises.copyFile(srcFilePath, distFilePath);
        console.log('File copied!');
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

createDir('project-dist', __dirname);
fillHTML();
fillCSS();
copyDir(path.join(__dirname, 'assets'), path.join('project-dist', 'assets'));
