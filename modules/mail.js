const Mail = {
  async init(browser) {
    this.page = await browser.newPage();
    await this.deleteCookies();
  },

  async deleteCookies() {
    await this.page.deleteCookie(...(await this.page.cookies("https://www.minuteinbox.com")));
  },

  async getEmail() {
    await this.page.goto("https://www.minuteinbox.com/", {
      waitUntil: ["load", "domcontentloaded"],
    });

    return await this.page.$eval("#email", (el) => {
      if (!el) throw new Error("Email Element not found!");
      return el.innerText.trim();
    });
  },

  async getActivateURL() {
    await this.page.waitForSelector('tr[data-href="2"]'); // waiting for verification email.
    await this.page.goto("https://www.minuteinbox.com/email/id/2", {
      waitUntil: ["load", "domcontentloaded"],
    });

    return await this.page.$eval('a[href^="https://zoom.us/activate"]', (anchor) => {
      if (!anchor) throw new Error("activate Element not found");
      return anchor.href.trim();
    });
  },

  async close() {
    await this.page.close()
  }
};

module.exports = Mail;
