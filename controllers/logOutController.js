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
// const User = require('../models/User');

// const handleLogout = async (req, res) => {
// On Client also Delete the Access Token
// const cookies = req.cookies;
// if (!cookies?.jwt) return res.sendStatus(204); // No Content to send back

// const refreshToken = cookies.jwt;

// Is refreshToken in the database?
// Check for users that has refreshToken available in cookies in the database
// Using User json model
// const foundUser = userDB.users.find(
//   (person) => person.refreshToken === refreshToken
// );

// Using User Model
// const foundUser = await User.findOne({
//   refreshToken,
// }).exec();

// if (!foundUser) {
//   res.clearCookie('jwt', refreshToken, {
//     httpOnly: true,
//     sameSite: 'None',
//     secure: true,
//   });
//   return res.sendStatus(204);
// }
// Delete the refreshToken in the database
// Using User json model
// const otherUsers = userDB.users.filter(
//   (person) => person.refreshToken !== foundUser.refreshToken
// );

// const currentUser = { ...foundUser, refreshToken: '' };
// userDB.setUsers([...otherUsers, currentUser]);
// await fsPromises.writeFile(
//   path.join(__dirname, '..', 'model', 'users.json'),
//   JSON.stringify(userDB.users)
// );

// Using User Model
//   foundUser.refreshToken = foundUser.refreshToken.filter(
//     (rt) => rt !== refreshToken
//   );
//   const result = await foundUser.save();
//   console.log(result);
//   res.clearCookie('jwt', refreshToken, {
//     httpOnly: true,
//     sameSite: 'None',
//     secure: true,
//   });
//   return res.sendStatus(204);
// };

// module.exports = { handleLogout };

const User = require('../models/User');

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No Content to send back
  const refreshToken = cookies.jwt;

  try {
    // Clear the refresh token in the user document
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      return res
        .status(204)
        .json({ message: 'No modifications were made' });
    }
    foundUser.refreshToken = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );
    const result = await foundUser.save();

    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    return res
      .status(204)
      .json({ message: 'Refresh token has been revoked' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { handleLogout };
