// # 添加示例代码到UserController.js
const User = require('../models/User');

class UserController {
    static create(name, email) {
        const user = new User(name, email);
        user.greet();
    }
}

module.exports = UserController

