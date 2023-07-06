const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');

const logEvents = async (message) => {
  const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss');
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, 'logs'))) {
      await fs.mkdirSync(path.join(__dirname, 'logs'));
    }
    {
      await fsPromise.appendFile(
        path.join(__dirname, 'logs', 'eventLog.txt'),
        logItem
      );
    }
    //testing
  } catch (e) {
    console.error(e);
  }
};

console.log('I am, CDG');

console.log(uuid());

module.exports = logEvents;
