const express = require('express')
const router = express.Router()
// 引入数据库
const mysql = require('../util/dbconfig')
var connection = null;
const nodemailer = require('nodemailer');


// 随机生成6位id
function YzId(n) {
    let str = "";
    const arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
    ];
    for (let i = 0; i < n; i++) {
        str += arr[Math.floor(Math.random() * arr.length)];
    }
    return str;
}
//通过req的hearers来获取客户端ip
var getIp = function (req) {
    var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
};
// 时间转换以及补零操作
function timestampToTime(timestamp) {
    var date = new Date(timestamp)
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1).toString().padStart(2, '0') + '-'
    var D = date.getDate().toString().padStart(2, '0') + ' '
    var h = date.getHours().toString().padStart(2, '0') + ':'
    var m = date.getMinutes().toString().padStart(2, '0') + ':'
    var s = date.getSeconds().toString().padStart(2, '0')
    return Y + M + D + h + m + s
}

// 存储验证码以供注册使用
var code = ''
// 存储用户注册时的邮箱以防伪注册
var oldemail = ''
// 获取验证码
router.get('/sendemail/register', (req, res) => {
    if (req.query.email === undefined) {
        res.send({
            code: 400,
            msg: '必填参数不能为空，请检查!'
        })
    } else {
        //2. 创建运输对象
        let transporter = nodemailer.createTransport({
            host: 'smtp.qq.com',
            secure: true,
            port: 465,
            auth: {
                user: '1492246804@qq.com', //qq邮箱账号
                pass: 'ixyjojhrhofcfjga' //邮箱的授权码
            }
        })
        // 存储验证码
        code = YzId(5)
        // 存储邮箱
        oldemail = req.query.email
        //3.配置发送邮件的信息
        let mailOptions = {
            from: '1492246804@qq.com', // 发送者
            to: req.query.email, // 传过来的邮箱
            subject: '注册验证码', // 邮件标题
            html: `验证码为:<b>${code}</b>，序号:<b>1</b>，注册使用`
        };
        //4.发送邮件
        transporter.sendMail(mailOptions, function (err, data) {
            //回调函数，用于判断邮件是否发送成功
            if (err) {
                console.log('发送异常' + err)
            } else {
                let result = {
                    code: 200,
                    msg: '验证码发送成功，请及时查收!',
                }

                res.send(result)
            }
        })
    }

})
router.post('/register', (req, res) => {
    // 数据库连接
    connection = mysql.createConnection();
    connection.connect();
    // 查询语句
    var sql = 'SELECT * FROM user_table Where uemail=?';
    var params = req.body.email
    try {
        if (req.body.code !== code || req.body.code === undefined) {
            res.send({
                code: 403,
                msg: '验证码有误'
            })
        } else {
            // 用户没有输入时
            if (req.body.email === undefined || req.body.name === undefined || req.body.pwd === undefined) {
                res.send({
                    code: 401,
                    msg: '必须参数为空，已知异常，请重新输入!',
                    xl: 0
                })
            } else {
                if (req.body.email !== oldemail) {
                    res.send({
                        code: 405,
                        msg: '邮箱不一致，请检查!'
                    })
                } else {
                    connection.query(sql, params, (err, result) => {
                        if (err) {
                            console.log('注册查重异常，请稍后重试!')
                            return
                        } else {
                            var result1;
                            // 查询结果数组长度不为零，就是有存在的数据
                            if (result.length !== 0) {
                                res.send({
                                    code: 202,
                                    msg: '该邮箱已经存在，请重新输入!',
                                    xl: 1
                                })
                            } else {
                                // 没有数据时候，进行注册
                                // 获取客户端的ip地址
                                var clientIp = getIp(req)
                                // 插入数据的sql语句
                                let sql = "INSERT INTO user_table(uid,uname,upwd,uemail,uimg,utime,uintroduction,uip,ustatus) VALUES(?,?,?,?,?,?,?,?,?)"
                                // 参数
                                let params = [YzId(6), req.body.name, req.body.pwd, req.body.email, 'http://192.168.1.80:3333/static/default.jpg', timestampToTime(Date.now()), "用户太懒了，还没有简介...", clientIp, '1']
                                connection.query(sql, params, (err, result) => {
                                    if (err) {
                                        result1 = {
                                            code: 401,
                                            msg: '注册数据库异常，请稍后重试!'
                                        }
                                    } else {
                                        result1 = {
                                            code: 200,
                                            result: {
                                                msg: "注册成功，请返回登录!",
                                                IP: clientIp,
                                                id: YzId(6)
                                            }
                                        }
                                        // 完成后进行验证码清空以及邮箱清空
                                        code=''
                                        oldemail=''
                                    }
                                    // 返回结果
                                    res.send(result1)
                                })
                            }
                        }
                        // 关闭数据库连接
                        connection.end();
                    })
                }
            }
        }
    } catch (e) {
        // 异常情况
        res.send(e)
        connection.end();
    }
})

// 映射出
module.exports = router
