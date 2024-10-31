const fs = require('fs');

class Helper {


     async checkAndCreateFolder(folderPath) {
        fs.access(folderPath, fs.constants.F_OK, (err) => {
            if (err) {
                // 文件夹不存在，创建文件夹
                fs.mkdir(folderPath, { recursive: true }, (mkdirErr) => {
                    if (mkdirErr) {
                        console.error('创建文件夹失败:', mkdirErr);
                    }
                });
            }
        });
    }

    getCurrentDateTime(format=null) {
        const timestamp = Date.now(); // 获取当前时间的时间戳
        const date = new Date(timestamp);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth()返回的月份是从0开始的，所以需要加1
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        let dateTimeString = format;
        dateTimeString = dateTimeString.replace('Y', year);
        dateTimeString = dateTimeString.replace('m', month);
        dateTimeString = dateTimeString.replace('d', day);
        dateTimeString = dateTimeString.replace('H', hours);
        dateTimeString = dateTimeString.replace('i', minutes);
        dateTimeString = dateTimeString.replace('s', seconds);

        return dateTimeString;
    }

}


module.exports = Helper;