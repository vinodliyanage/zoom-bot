const Zoom = {
  async init(browser) {
    this.page = await browser.newPage();
    await this.deleteCookies();
    const cookies = [
      {
        name: "_zm_age_gating",
        value: "1",
        url: "https://zoom.us",
      },
      {
        name: "OptanonAlertBoxClosed",
        value: new Date().toISOString(),
        url: "https://zoom.us",
      },
    ];

    await this.page.setCookie(...cookies);
  },

  async deleteCookies() {
    await this.page.deleteCookie(...(await this.page.cookies("https://zoom.us")));
  },

  async signup(email) {
    await this.page.goto("https://zoom.us/signup", {
      waitUntil: ["load", "domcontentloaded"],
    });
    await this.page.$eval(
      "input#email",
      (input, email) => {
        input.value = email;
        input.dispatchEvent(new Event("input"));
      },
      email
    );

    await this.page.click("#signup-button");
  },

  async activateAccount(activateURL, { first_name, last_name, password }) {
    await this.page.goto(activateURL, {
      waitUntil: ["load", "domcontentloaded"],
    });
    await this.page.waitForSelector("#password-form");

    await this.page.$eval(
      "#password-form #firstName",
      (input, first_name) => {
        input.value = first_name;
        input.dispatchEvent(new Event("input"));
      },
      first_name
    );
    await this.page.$eval(
      "#password-form #lastName",
      (input, last_name) => {
        input.value = last_name;
        input.dispatchEvent(new Event("input"));
      },
      last_name
    );
    await this.page.$eval(
      "#password-form #password",
      (input, password) => {
        input.value = password;
        input.dispatchEvent(new Event("input"));
      },
      password
    );
    await this.page.$eval(
      "#password-form #confirm_password",
      (input, password) => {
        input.value = password;
        input.dispatchEvent(new Event("input"));
      },
      password
    );

    await this.page.click("#password-form button");
    await this.page.waitForNavigation({
      waitUntil: ["load", "domcontentloaded"],
    });

    return await this.getZoomLink(activateURL);
  },

  async getZoomLink(activateURL) {
    /**
     * acitvate https://zoom.us/activate?code=ag2GEOlW8zNf8yjiGaIK4HDaIV93eWw7uL7fKk3xy_I.AG.nJXu6aBuzsM7q_vtLSap1OVXwsTexZv8ujl6ex9VueM-35pU2iiLS301X0dPeMwZjLaS7pTINhIsMDO5YCpbdslrTqrgocJUUTaKsyEj0oxnCxBAAti1vGUGPuMIQkPW_ox1SB5NPjijupO_zXQJNtMlc_x7_CFOLPAaVpjmKc65p34.dgglR0ZV6R3ySxtCKF9Rug.hHMvO7V9kUX-4mNc&fr=signup
     * invite https://zoom.us/invite_colleague?code=ag2GEOlW8zNf8yjiGaIK4HDaIV93eWw7uL7fKk3xy_I.AG.nJXu6aBuzsM7q_vtLSap1OVXwsTexZv8ujl6ex9VueM-35pU2iiLS301X0dPeMwZjLaS7pTINhIsMDO5YCpbdslrTqrgocJUUTaKsyEj0oxnCxBAAti1vGUGPuMIQkPW_ox1SB5NPjijupO_zXQJNtMlc_x7_CFOLPAaVpjmKc65p34.dgglR0ZV6R3ySxtCKF9Rug.hHMvO7V9kUX-4mNc&fr=signup
     * test meeting https://zoom.us/signup/skipped?code=ag2GEOlW8zNf8yjiGaIK4HDaIV93eWw7uL7fKk3xy_I.AG.nJXu6aBuzsM7q_vtLSap1OVXwsTexZv8ujl6ex9VueM-35pU2iiLS301X0dPeMwZjLaS7pTINhIsMDO5YCpbdslrTqrgocJUUTaKsyEj0oxnCxBAAti1vGUGPuMIQkPW_ox1SB5NPjijupO_zXQJNtMlc_x7_CFOLPAaVpjmKc65p34.dgglR0ZV6R3ySxtCKF9Rug.hHMvO7V9kUX-4mNc&fr=signup
     *
     *
     * code=ag2GEOlW8zNf8yjiGaIK4HDaIV93eWw7uL7fKk3xy_I.AG.nJXu6aBuzsM7q_vtLSap1OVXwsTexZv8ujl6ex9VueM-35pU2iiLS301X0dPeMwZjLaS7pTINhIsMDO5YCpbdslrTqrgocJUUTaKsyEj0oxnCxBAAti1vGUGPuMIQkPW_ox1SB5NPjijupO_zXQJNtMlc_x7_CFOLPAaVpjmKc65p34.dgglR0ZV6R3ySxtCKF9Rug.hHMvO7V9kUX-4mNc&fr=signup
     * code=ag2GEOlW8zNf8yjiGaIK4HDaIV93eWw7uL7fKk3xy_I.AG.nJXu6aBuzsM7q_vtLSap1OVXwsTexZv8ujl6ex9VueM-35pU2iiLS301X0dPeMwZjLaS7pTINhIsMDO5YCpbdslrTqrgocJUUTaKsyEj0oxnCxBAAti1vGUGPuMIQkPW_ox1SB5NPjijupO_zXQJNtMlc_x7_CFOLPAaVpjmKc65p34.dgglR0ZV6R3ySxtCKF9Rug.hHMvO7V9kUX-4mNc&fr=signup
     * code=ag2GEOlW8zNf8yjiGaIK4HDaIV93eWw7uL7fKk3xy_I.AG.nJXu6aBuzsM7q_vtLSap1OVXwsTexZv8ujl6ex9VueM-35pU2iiLS301X0dPeMwZjLaS7pTINhIsMDO5YCpbdslrTqrgocJUUTaKsyEj0oxnCxBAAti1vGUGPuMIQkPW_ox1SB5NPjijupO_zXQJNtMlc_x7_CFOLPAaVpjmKc65p34.dgglR0ZV6R3ySxtCKF9Rug.hHMvO7V9kUX-4mNc&fr=signup
     * ? codes are same.
     */

    const newURL =
      "https://zoom.us/signup/skipped?" + activateURL.split("?")[1];

    await this.page.goto(newURL, {
      waitUntil: ["load", "domcontentloaded"],
    });

    // https://zoom.us/j/XXX?pwd=XXX#success
    // 'a[href*="zoom.us/j/"][href*="pwd"]'

    return await this.page.$eval(
      'a[href*="zoom.us/j/"][href*="pwd"]',
      (anchor) => anchor.href.trim()
    );
  },

  async close() {
    await this.page.close();
  },
};

module.exports = Zoom;
