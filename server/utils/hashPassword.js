const bcrypt = require("bcrypt");

/*
  HASH PASSWORD
*/

async function hashPassword(password) {
  try {
    const saltRounds = 10;

    const hashedPassword =
      await bcrypt.hash(
        password,
        saltRounds
      );

    return hashedPassword;
  } catch (error) {
    console.error(
      "Ошибка хеширования пароля:",
      error
    );

    throw error;
  }
}

module.exports = hashPassword;