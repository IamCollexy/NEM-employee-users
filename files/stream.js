const fs = require('fs');

const rs = fs.createReadStream('./lorem.txt', {
  encoding: 'utf8',
});

const ws = fs.createWriteStream('./new-lorem.txt');

// rs.on('data', (dataChunk) => {
//   ws.write(dataChunk);
// });

// more Efficiently we use pipe
rs.pipe(ws);
