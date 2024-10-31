const cluster = require('cluster');
const PuppetController = require('./controllers/PuppetController.js');
const yaml = require("js-yaml");
const fs = require('fs');
const path = require("path");

let sitesInstance = [];
global.folder = path.join(__dirname, '..', '/');
const yamlDoc = yaml.load(fs.readFileSync('../sites.txt', 'utf8'));
async function getSiteList() {
// 读取YAML文件
    try {
        // const doc = yaml.load(fs.readFileSync('../sites.txt', 'utf8'));
        console.log(yamlDoc['weblist']);

        for (const docElement of yamlDoc['weblist']) {
            console.log(docElement['url'])
            if (docElement['url'].trim() !=='') {
                sitesInstance.push(docElement)
            }
        }
        return true
    } catch (e) {
        console.error(e);
    }

}

async function runPuppet(newtaburl)
{
    try {
        let puppetCls = new PuppetController()
        let url = "https://www.baidu.com"
        // let proxyIp = "123.45.67.89:8888"
        let proxyIp = null
        puppetCls.init(proxyIp).then(() => {
            puppetCls.openPage(url).then((r) => {
                try {
                    if (!r) {
                        process.exit(1);
                    } else {
                        if (newtaburl) {
                            puppetCls.openNewTab(newtaburl)
                        }
                    }
                }catch (error) {
                    console.log(error)
                }
            })
        })
    } catch (error) {
        console.error('line: 47 openNewTab failed:', error);
    }

}


async  function startCluster() {
    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);

        // 衍生工作进程。
        for (let i = 0; i < sitesInstance.length; i++) {
            const site = sitesInstance[i];
            cluster.fork({SITE_URL: site.url.trim()});
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });

    } else {
        // 在工作进程中，通过 process.env 获取传递的 site.url
        const siteUrl = process.env.SITE_URL;
        runPuppet(siteUrl.trim()).catch((error) => {
            console.error('runPuppet failed:', error);
            process.exit(1); // 如果 runPuppet 失败，退出进程
        });
    }

}

async function executeInGroups(totalGroups) {
    for (let i = 0; i < totalGroups; i++) {
        const siteList = await getSiteList(); // 等待 getSiteList() 完成
        if (siteList) {
            await startCluster(); // 等待 startCluster() 完成
        }
    }
}


const clickCount = yamlDoc['clickCount'][0]['count']
executeInGroups(clickCount); // 调用函数，以分组方式执行3次






