const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream/promises');

async function mergeCSS() {
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'));
  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
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

mergeCSS();
