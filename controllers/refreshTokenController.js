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
  res.clearCookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  // Check for users that has refreshToken available in cookies in the database
  // Using User json model
  // const foundUser = userDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );

  // Using User json model
  const foundUser = await User.findOne({
    refreshToken,
  }).exec();

  // Detected refresh token reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) res.sendStatus(403); //Forbidden
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec();
        hackedUser.refreshToken = [];
        // If you wanted to go back to put all the code that actually saves
        // the access token to the database and check those against the database,
        // then you could empty the access token as well and it will force an immediate
        // login next time the user attempts to request anything from the api.
        // This will logout the user alot faster
        const result = await hackedUser.save();
        console.log(result);
      }
    );
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if (err || foundUser.username !== decoded.username)
        return res.sendStatus(403);

      //Refresh token was still valid
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

      // we will create a refresh token here because a new refresh token is gonna be sent everytime we send
      // that new access token as well

      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: '1d',
        }
      );

      // Saving refreshToken with current user
      foundUser.refreshToken = [
        ...newRefreshTokenArray,
        newRefreshToken,
      ];
      const result = await foundUser.save();
      console.log(result);

      // Creates Secure Cookie with refresh token
      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ roles, accessToken });
      // You can eliminate sending the roles here, Just send the access token, because we are putting the roles in the access token.
      // But you will need jwtdecode or another library like jwtdecode if you are gonna pull the roles out
    }
  );
};

module.exports = { handleRefreshToken };
