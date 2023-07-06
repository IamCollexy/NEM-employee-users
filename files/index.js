// const fs = require('fs');
const path = require('path');
const filePath = 'starter.txt';
//Like this
const fsPromises = require('fs').promises;
// Instead of
// const fsPromises = require('fs');

const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(
      path.join(__dirname, filePath),
      'utf8'
    );
    console.log(data);
    await fsPromises.unlink(path.join(__dirname, 'starter.txt'));
    await fsPromises.writeFile(
      path.join(__dirname, 'promiseWrite.txt'),
      data
    );
    await fsPromises.appendFile(
      path.join(__dirname, 'promiseWrite.txt'),
      '\n\nNice to meet you'
    );
    await fsPromises.rename(
      path.join(__dirname, 'promiseWrite.txt'),
      path.join(__dirname, 'SuccessfullyRenamed.txt')
    );

    const newData = await fsPromises.readFile(
      path.join(__dirname, 'SuccessfullyRenamed.txt'),
      'utf8'
    );
    console.log(newData);
  } catch (err) {
    console.error(err);
  }
};
fileOps();

// utf8 defines encoding
// const absolutePath = path.join(__dirname, filePath);
// console.log('Absolute path:', absolutePath);

// fs.readFile(absolutePath, 'utf8', (error, data) => {
//   if (error) {
//     if (error.code === 'ENOENT') {
//       // Handle file not found error
//       console.error('File not found:', filePath);
//     } else {
//       // Handle other types of errors
//       throw error;
//     }
//   } else {
//     // File exists, do something with the data
//     console.log(data);
//   }
// });
console.log('hello world');

// fs.writeFile(
//   path.join(__dirname, 'reply.txt'),
//   'I need substances',
//   (error) => {
//     if (error) throw error;
//     console.log('write complete');
//   }
// );
// fs.appendFile(
//   path.join(__dirname, 'append.txt'),
//   ' They make me see myself ',
//   (error) => {
//     if (error) throw error;
//     console.log('Append complete');
//   }
// );

//
// fs.rename(
//   path.join(__dirname, 'reply.txt'),
//   path.join(__dirname, 'respond.txt'),

//   (error) => {
//     if (error) throw error;
//     console.log('Rename complete');
//   }
// );

//exit on uncaught errors

// process.on('uncaughtError', (err) => {
//   console.log(`There was an error: '${err}`);
//   process.exit(1);
// });
