const jwt = require("jsonwebtoken");

/*
  GENERATE JWT TOKEN
*/

function generateToken(user) {
  const token = jwt.sign(
    {
      id: user.id,

      email: user.email,

      role: user.role || "user"
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d"
    }
  );

  return token;
}

module.exports = generateToken;