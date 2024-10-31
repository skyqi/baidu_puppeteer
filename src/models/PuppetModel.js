class PuppetModel {
    constructor(browser, page) {
        this.browser = browser;
        this.page = page;
    }

    greet() {
        console.log(`Hello, my name is ${this.browser} and my email is ${this.page}.`);
    }
}

module.exports = PuppetModel;
