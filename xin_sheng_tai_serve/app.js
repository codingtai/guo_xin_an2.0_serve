var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 跨域
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//改写
var http = require('http');
const { urlencoded } = require('body-parser');
var server = http.createServer(app);

// 解析 application/json
// app.use(bodyParser.json());
// 加入cookie签名
// app.use(cookieParser('I LOVE LXD')); //使用cookie中间件，加密值为：I LOVE LXD
//设置跨域访问
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "content-type");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By", ' 3.2.1')
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// })
// 解析 application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({
//     extended: false
//   }));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//静态资源
app.use(express.static(path.join(__dirname, 'public')));

//post请求
app.use(bodyParser.urlencoded({extended:true}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 引入登录模块
// const login = require('./mail/login')
// app.use(login)
// 引入注册模块
// const register=require('./mail/register')
// app.use(register)
// 引入验证码发送模块
// const email=require('./util/sendemail')
// app.use(email)
// 引入忘记密码模块
// const forget=require('./mail/forget')
// app.use(forget)


server.listen('3000',()=>{
  console.log('服务端启动成功...');
  console.log('http://localhost:3000');
});

