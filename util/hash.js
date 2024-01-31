  const bcrypt = require('bcrypt');

  exports.hashString = (password) => {
    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}