// Folder Database / State Manager
// Using User json model
// const userDB = {
//   users: require('../model/users.json'),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// Using User Model
const User = require('../models/User');

// Used when you are writing to files
// const fsPromises = require('fs').promises;
// const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password)
    return res
      .status(400)
      .json({ message: 'Username and Password are required.' });

  // Using User json model
  // Check for duplicate usernames in the database
  // const duplicateUser = userDB.users.find(
  //   (person) => person.username === user
  // );

  // Using User Model
  // not all mongoose method needs exec on the data model but in this very one we need it. That is because we could pass in a call back afterwards e.g errorResult for example. when you use any methodyou are not sure of and you are using async await then you have to put .exec()
  const duplicateUser = await User.findOne({ username: user }).exec();

  if (duplicateUser) return res.sendStatus(409); // Conflict
  try {
    // encrypt the password, passing 10 salt rounds as an argument
    const hashedPassword = await bcrypt.hash(password, 10); // Await the bcrypt.hash() function
    // store the new user
    // const newUser = {
    //   username: user,
    //   roles: {
    //     user: 2001,
    //   },
    //   password: hashedPassword,
    // };

    //For when you are working with json database stored in your folder
    // userDB.users.push(newUser);
    // await fsPromises.writeFile(
    //   path.join(__dirname, '..', 'model', 'users.json'),
    //   JSON.stringify(userDB.users)
    // );
    // console.log(userDB.users);

    // In Mongoose Create and Store Users at once
    const result = await User.create({
      username: user,
      password: hashedPassword,
    });

    console.log(result);
    res.status(201).json({
      success: `New user: ${user} created!`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
