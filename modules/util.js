const fs = require("fs-extra");

const saveFile = async (data) => {
  const file = `./accounts/zm-acc-${new Date()
    .toUTCString()
    .replace(/:/g, "-")}.txt`;
  try {
    await fs.outputFile(file, data);
  } catch (err) {
    console.error(err);
  }
};

const generateRandomUser = (length = 8) => {
  const lettersArray = "abcdefghijklmnopqrstuvexyz".split("");
  let first_name = "",
    last_name = "",
    password = "a1B";

  for (let i = 0; i < length; i++) {
    first_name += lettersArray[Math.floor(Math.random() * lettersArray.length)];
    last_name += lettersArray[Math.floor(Math.random() * lettersArray.length)];
    password += lettersArray[Math.floor(Math.random() * lettersArray.length)];
  }
  
  return {
    first_name,
    last_name,
    password,
  };
};

module.exports.generateRandomUser = generateRandomUser;
module.exports.saveFile = saveFile;
