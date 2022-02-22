const puppeteer = require("puppeteer");
const prompt = require("prompt-sync")();

const zoom = require("./modules/zoom");
const mail = require("./modules/mail");
const { generateRandomUser, saveFile, logger } = require("./modules/util");
const { windowSize, windowPosition } = require("./config/config");

const automate = async (browser) => {
  await mail.init(browser);

  logger.log(logger.FgYellow, "Generating random email...", "?");
  const email = await mail.getEmail();
  logger.log(logger.FgGreen, "Email created successfully!", "+");

  await zoom.init(browser);
  await zoom.signup(email);

  logger.log(logger.FgYellow, "Searching for Activate url...", "?");
  const activateURL = await mail.getActivateURL();
  logger.log(logger.FgGreen, "Activate url found!", "+");

  await mail.close();

  logger.log(logger.FgYellow, "Activating Zoom account...", "?");

  const { first_name, last_name, password } = generateRandomUser();
  const meetingLink = await zoom.activateAccount(activateURL, {
    first_name,
    last_name,
    password,
  });
  await zoom.close();

  const zoomData = `
  email: ${email}
  password: ${password}
  first name: ${first_name}
  last name: ${last_name}
  meeting link: ${meetingLink}
  `;
  await saveFile(zoomData);

  logger.log(logger.FgGreen, "Account created successfully!", "+");
  logger.log(logger.FgCyan, zoomData);
};

(async () => {
  var input = parseInt(prompt("How many accounts do you want: "));
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--window-size=${windowSize.width},${windowSize.height}`,
      `--window-position=${windowPosition.x},${windowPosition.y}`,
    ],
  });
  for (let i = 0; i < input; i++) await automate(browser);
  browser.close();
})();
