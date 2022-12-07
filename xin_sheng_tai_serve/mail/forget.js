const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');
// 引入数据库
const mysql = require('../util/dbconfig')
var connection = null;
router.post('/forget/user', (req, res) => {
    if (req.body.email === undefined) {
        res.send({
            code: 400,
            msg: '必填参数不能为空，请仔细检查'
        })
    } else {
        // 数据库连接
        connection = mysql.createConnection();
        connection.connect();
        var result1
        var sql = "SELECT * From user_table Where uemail=?"
        var params = req.body.email
        connection.query(sql, params, (err, result) => {
            if (err) {
                console.log('查询忘记密码邮箱数据库异常')
                return
            } else {
                if (result.length !== 0) {
                    forget(req.body.email, result[0].uname, result[0].upwd,req)
                    result1 = {
                        code: 200,
                        msg: '您的个人信息已经发送至您的邮箱，请注意查收!'
                    }
                } else {
                    result1 = {
                        code: 401,
                        msg: '暂无此用户，请先去注册!'
                    }
                }
            }
            // 返回结果，关闭数据库连接
            res.send(result1)
            connection.end();
        })
    }
})
// 发送邮件找回密码
function forget(email, name, pwd,req) {
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
    //3.配置发送邮件的信息
    let mailOptions = {
        from: '', // 发送者
        to: email, // 传过来的邮箱
        subject: '忘记密码找回', // 邮件标题
        html: `用户名:<b>${name}</b>，<br>邮箱:<b>${email}</b>，<br>密码:<b>${pwd}</b>，<br>操作ip:<b>${getIp(req)}</b>（我们不会存储您的IP信息，仅作为提示所用。）,<br>请妥善保管您的个人信息!`
    };
    //4.发送邮件
    transporter.sendMail(mailOptions, function (err, data) {
        //回调函数，用于判断邮件是否发送成功
        if (err) {
            console.log('发送异常' + err)
        } else {
            let data = {
                code: 200,
                msg: '验证码发送成功',
            }
            res.send(data)
        }
    })
}
//通过req的hearers来获取客户端ip
var getIp = function (req) {
    var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
};
module.exports = router
