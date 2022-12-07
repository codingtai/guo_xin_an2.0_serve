//发送邮箱验证码

const nodemailer = require('nodemailer');
var $commonJS = require('./common.js');

// 创建可重用邮件传输器
const transporter = nodemailer.createTransport({
    host: "smtp.qq.com", // qq的邮件地址
		// host: "smtp.126.com", // 网易的邮件地址
    port: 465, // 端口
    secureConnection: false, // use SSL
    auth: {
        "user": '1492246804@qq.com', // 邮箱账号
        "pass": 'ixyjojhrhofcfjga' // 邮箱的授权码
    }
});
const send = (mailOptions) => {
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
    });
}
let emailCode = $commonJS.randomn(6) //验证码为6位随机数，这个自己用random（）写就行
let email = {
    title: '新生态',
    htmlBody: `
            <p>你好！</p>
            <p>您正在注册新生态环境监督平台账号</p>
            <p>你的验证码是：<strong style="color: #ff4e2a;">${emailCode}</strong></p>
            <p>  ---该验证码5分钟内有效---  </p>`
}
let mailOptions = {
    from: '1492246804@qq.com', // 发件人地址
    to: '' ,// 收件人地址，多个收件人可以使用逗号分隔
    subject: email.title, // 邮件标题
    html: email.htmlBody // 邮件内容
};
module.exports={
	sendMails(email){
		return new Promise((resolve, reject) => {
			mailOptions.to = email;
			transporter.sendMail(mailOptions, function(error, info) {
	     if (error) {
				resolve(false);
	     }
				resolve(emailCode);
		});
		})
	},
}

