// // Folder Database / State Manager
// Using User json model
// const userDB = {
//   users: require('../model/users.json'),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// Using User Model
const User = require('../models/User');

const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  // Check for users that has refreshToken available in cookies in the database
  // Using User json model
  // const foundUser = userDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );

  // Using User json model
  const foundUser = await User.findOne({
    refreshToken,
  }).exec();

  if (!foundUser) return res.sendStatus(403); //Forbidden
  //evaluate jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username)
        return res.sendStatus(403);
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2m' }
      );
      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
