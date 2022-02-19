const puppeteer = require("puppeteer");
const prompt = require("prompt-sync")();

const zoom = require("./modules/zoom");
const mail = require("./modules/mail");
const { generateRandomUser, saveFile } = require("./modules/util");
const { windowSize, windowPosition } = require("./config/config");

const automate = async (browser) => {
  await mail.init(browser);
  const email = await mail.getEmail();
  await zoom.init(browser);
  await zoom.signup(email);

  const activateURL = await mail.getActivateURL();
  await mail.close();

  const { first_name, last_name, password } = generateRandomUser();
  const meetingLink = await zoom.activateAccount(activateURL, {
    first_name,
    last_name,
    password,
  });

  const zoomData = `
  email: ${email}
  password: ${password}
  first name: ${first_name}
  last name: ${last_name}
  meeting link: ${meetingLink}
  \n
  `;
  await saveFile(zoomData);
  await zoom.close();
  console.log("Account Created Successfully!");
};

(async () => {
  var input = parseInt(prompt("How many account do you want: "));
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
