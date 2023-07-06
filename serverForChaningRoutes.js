// // Route handlers
// app.get(
//   '/hello(.html)?',
//   (req, res, next) => {
//     console.log('attempted to load Hello.html');
//     next();
//   },
//   (req, res) => {
//     res.send('Hello World!');
//   }
// );

// // Chaining Route handlers
// const one = (req, res, next) => {
//   console.log('one');
//   next();
// };
// const two = (req, res, next) => {
//   console.log('two');
//   next();
// };
// const three = (req, res) => {
//   console.log('three');
//   res.send('Finished!');
// };

// app.get('/chain(.html)?', [one, two, three]);
