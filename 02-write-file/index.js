const path = require('path');
const fs = require('fs');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdin, stdout } = process;

stdout.write('Hello! Enter your text!\n');
stdin.on('data', (data) => {
  if (data.toString() === 'exit\r\n') process.exit();
  writeStream.write(data);
});

process.on('exit', () => stdout.write('Bye!\n'));
process.on('SIGINT', () => process.exit());
