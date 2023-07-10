// // Folder Database / State Manager
// Using User json model
// const userDB = {
//   users: require('../model/users.json'),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
// const fsPromises = require('fs').promises;
// const path = require('path');

// Using User Model
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const cookies = req.cookies;
  const { user, password } = req.body;
  if (!user && !password)
    return res
      .status(400)
      .json({ message: 'Username and Password are required' });

  // Using User json model
  // Check for duplicate usernames in the database
  // const duplicateUser = userDB.users.find(
  //   (person) => person.username === user
  // );

  // Using User Model
  // not all mongoose method needs exec on the data model but in this very one we need it. That is because we could pass in a call back afterwards e.g errorResult for example. when you use any methodyou are not sure of and you are using async await then you have to put .exec()
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //unauthorized
  //evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs to use with the other routes that we want protected
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '3m',
      }
    );
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    //Saving refreshToken with current user
    // Using User json model
    // const otherUsers = userDB.users.filter(
    //   (person) => person.username !== foundUser.username
    // );
    // const currentUser = { ...foundUser, refreshToken };
    // userDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(
    //   path.join(__dirname, '..', 'model', 'users.json'),
    //   JSON.stringify(userDB.users)
    // );
    // set Cookie as httpOnly so it is not available by JavaScript ensuring  our Refresh Token is safe.

    // Using User model

    const newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt)
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
    foundUser.refreshToken = [
      ...newRefreshTokenArray,
      newRefreshToken,
    ];
    const result = await foundUser.save();
    console.log(result);
    console.log(roles);

    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      // When Testing with Thunder Client,
      // It honours the cookie setting for secure true or not,
      // And If we were to set a cookie and then use the refresh token here,
      // you would need to remove  secure: true,
      // or the cookies will not work with thunder client
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // store access token in memory
    res.json({ roles, accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
