const fs = require('fs');
const path = require('path');

fs.promises
  .readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((data) => {
    data.forEach(async (dirent) => {
      if (dirent.isFile()) {
        const basename = path.basename(dirent.name, path.extname(dirent.name));
        const ext = path.extname(dirent.name).slice(1);
        const size = (await fs.promises.stat(dirent.path + '\\' + dirent.name))
          .size;
        console.log(`${basename} - ${ext} - ${size / 1000}kb`);
      }
    });
  });
