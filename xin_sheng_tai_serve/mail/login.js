const express = require('express')
const router = express.Router()
// token生成插件模块
const jwt = require('jsonwebtoken');
// Token签名
var secret = 'I LOVE LXD';
// 引入数据库
const mysql = require('../util/dbconfig')
var connection = null;
router.post('/login', (req, res) => {
    // 数据库连接
    connection = mysql.createConnection();
    connection.connect();
    // 查询语句
    var sql = 'SELECT * FROM user_table Where uemail=?';
    // 前端传来参数
    var params = [req.body.email, req.body.pwd]
    //登录验证
    connection.query(sql,req.body.email, function (err, result) {
        // 存储返回结果
        var result1
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            result1 = {
                code: 501,
                msg: '数据库链接失败...'
            }
            return;
        } else {
            // 用户没有输入时
            if (req.body.email === undefined || req.body.pwd === undefined) {
                result1 = {
                    code: 401,
                    msg: '邮箱或密码不能为空',
                    xl: 0
                }
            } else {
                if(result.length!==0){
                    console.log(result)
                    for (let i = 0; i < result.length; i++) {
                        // 邮箱或者密码不正确的时候
                        if (req.body.email !== result[i].uemail || req.body.pwd !== result[i].upwd) {
                            result1 = {
                                code: 400,
                                result: '邮箱或者密码错误!',
                                xl: 1
                            }
                        }
                        // 邮箱和密码输入正确
                        if (req.body.email === result[i].uemail && req.body.pwd === result[i].upwd) {
                            // 获取客户端的ip地址
                            var clientIp = getIp(req)
                            // 传输的token内容
                            let payload = { uid: result[i].uid ,ip:clientIp};
                            let token = jwt.sign(payload, secret);
                            console.log("用户信息存储token:"+token)
                            // 写入cookie中
                            res.cookie('tooken', token, { httpOnly: true, signed: true })
                            // 返回结果
                            result1 = {
                                code: 200,
                                token: token,
                                msg: '信息正确，返回登录',
                                xl:2,
                                ip:clientIp
                            }
                        }
    
                    }
                }else{
                    result1={
                        code:402,
                        msg:'账号不存在请注册!'
                    }
                }
 
            }

        }
        // 返回结果，关闭数据库连接
        res.send(result1)
        connection.end();
    });
})
//通过req的hearers来获取客户端ip
var getIp = function (req) {
    var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
};

module.exports = router;
