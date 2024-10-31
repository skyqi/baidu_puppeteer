// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');

const path = require('path');
const Helper = require('../utils/helper.js')
const helperCls = new Helper()
// const StealthPlugin = require("../../node_modules/puppeteer-extra-plugin-stealth");
// const StealthPlugin = require(path.resolve(__dirname)+'/node_modules/puppeteer-extra-plugin-stealth');

// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// // const useProxy = require('puppeteer-page-proxy') #只用于tab页面的ip代理
//
// puppeteer.use(StealthPlugin());
const PuppetModel = require('../models/PuppetModel.js')



class PuppetController {

    constructor() {
        this.browser = null;
        this.page = null;
        this.puppetmodel = null;
    }

    // 初始化方法，用于启动浏览器
    async init(proxyIp = null) {
        await this.launchBrowser(proxyIp);
    }

    async launchBrowser(proxyIp = null) {
        // 定义启动配置
        const launchOptions = {
            args: [], // 确保这里初始化为空数组
            headless: true, // 设置为false可以在屏幕上看到浏览器操作
            ignoreHTTPSErrors: true, // 忽略 HTTPS 错误
            // slowMo: 300, // 每个操作延迟 100ms
        };
        // const executablePath = 'C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'; // Chrome 可执行文件的路径
        launchOptions.args.push(`--no-sandbox`);

        // 如果提供了proxyIp，则添加到启动配置中
        if (proxyIp) {
            launchOptions.args.push(`--proxy-server=${proxyIp}`);
        }
        // 添加executablePath到启动配置中
        launchOptions.executablePath = this.revisionInfo;

        // 使用配置启动浏览器
        this.browser = await puppeteer.launch(launchOptions);
    }

    async openPage(url) {
        // try {
            if (this.browser) {
                this.page = await this.browser.newPage();
                await this.page.goto(url, {
                    waitUntil: 'networkidle0', // 等待直到网络空闲
                    timeout: 45000, // 设置超时为45秒
                });
                // ####
                try {
                    await this.page.waitForSelector('body', {timeout: 5000}); // 确保页面主体已加载
                }catch (error) {
                    if (this.page) { await this.page.close() }
                    throw new Error('waitForSelector failed:'+ error)
                }

                try {
                    // 获取页面的可见文本
                    // 错误的调用，注意额外的逗号
                    const content = await this.page.evaluate(() => {
                        return document.body.innerText;
                    },); // 这里不应该有逗号
                    // 检查页面内容是否为空
                    if (content.trim() === '') {
                        if (this.page) { await this.page.close() }
                        if (this.browser) { await this.browser.close() }
                        throw new Error('页面内容为空，关闭页面')
                    }
                    return true

                }catch (error) {
                    if (this.page) { await this.page.close() }
                    // throw new Error('page.evaluate error:'+ error)
                    console.log('page.evaluate error:'+ error)
                    return false
                }

            } else {
                if (this.browser) {
                    await this.browser.close();
                }
                throw new Error('Browser has not been launched');
            }

        // } catch (error) {
        //     console.error('line 99, openPage failed:', error);
        //     // throw new Error('openPage failed:',error);
        // }

    }

    async openNewTab(newtablurl) {
        try {
            if (!this.browser) {
                throw new Error('browser failed:!');
            }
                // 打开一个新的标签页
                this.page = await this.browser.newPage();

                // 导航到指定的URL
                await this.page.goto(newtablurl, {
                    waitUntil: 'networkidle0', // 等待直到网络空闲
                    timeout: 45000, // 设置超时为45秒
                });

                // 确保页面主体已加载
                try {
                    await this.page.waitForSelector('body', { timeout: 5000 });
                } catch (error) {
                    // 如果waitForSelector失败，关闭当前页面并抛出错误
                    await this.page.close();
                    throw new Error('waitForSelector failed: ' + error.message);
                }

                // 获取页面的可见文本
                const content = await this.page.evaluate(() => document.body.innerText);

                // 检查页面内容是否为空
                if (content.trim() === '') {
                    // 如果页面内容为空，关闭当前页面和浏览器，并抛出错误
                    await this.page.close();
                    await this.browser.close();
                    throw new Error('页面内容为空，关闭页面');
                }
                const randomString = () => Math.random().toString(36).substring(2, 8);
                const timestamp = Date.now();
                // 生成随机文件名，包含时间戳
                const randomFilename = helperCls.getCurrentDateTime('YmdHis') + ".png"

                const folderPath = path.join(global.folder,'screenshot')
                await helperCls.checkAndCreateFolder(folderPath)
                this.captureScreenshot(path.join(folderPath,  randomFilename))
                // 如果一切正常，返回true
                setTimeout(async () => {
                    try {
                        console.log('30秒已到，正在关闭浏览器...');
                        if (this.page) {
                            await this.page.close();
                        }
                        if (this.browser) {
                            await this.browser.close();
                        }
                        process.exit(); // 从进程中退出
                    } catch (error) {
                        console.error('settimeout error!')
                        process.exit(); // 从进程中退出
                    }
                }, 32000);
                return true;

        } catch (error) {
            // 打印错误信息
            console.error('line 127 openNewTab failed:', error);
            // 可以选择抛出错误或进行处理
            // throw new Error('openNewTab failed: ' + error.message);
        }
    }

    async captureScreenshot(path) {
        if (this.page) {
            await this.page.screenshot({path});
            console.log(`Screenshot saved to ${path}`);
        } else {
            throw new Error('Page has not been opened');
        }
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }

}

module.exports = PuppetController