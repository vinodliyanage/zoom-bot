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

const logger = (() => {
  return {
    Reset: "\x1b[0m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
  
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
  
    log(code, msg, prefix = "") {
      if (prefix.length) prefix = `[${prefix}] `;
      console.log(`${code}${prefix}${msg}${this.Reset}`);
    },
  }
})();

module.exports = {
  logger,
  generateRandomUser,
  saveFile
}