function rand(min,max){
    return Math.floor(Math.random()*(max-min))+min
}
validataPhonecode = []
let sendCodeP = (phone)=>{
    for(var item of validataPhonecode){
        if(phone==item.phone){
            return true
        }
    }
    return false
}

let findCodeAndPhone=(phone,code)=>{
    for(var item of validataPhonecode){
        if(phone==item.phone&&code==item.code){
            return 'login'
        }
    }
    return 'error'
}


//模拟验证码的发送接口
sendCode=(req,res)=>{
    let phone=req.query.phone;
    if(sendCodeP(phone)){
        res.send({
            'code':400,
            'msg':'已经发送过验证码，稍后再发'
        })
    }
    let code = rand(1000,9990);
    validataPhonecode.push({
        'phone':phone,
        'code':code
    })
    console.log(validataPhonecode)
    res.send({
        'code':200,
        'msg':'发送成功'
    })
    console.log(code)
}
//验证码登录
codePhoneLogin = (req,res)=>{
    let {phone,code} = req.query;
    if(sendCodeP(phone)){
        let status = findCodeAndPhone(phone,code);
        if(status == 'login'){
            res.send({
                'code':200,
                'msg':'登陆成功'
            })
        }else if(status=='error'){
                res.send({
                    'code':200,
                    'msg':'登录失败'
                })
        }
    }else{
        res.send({
            'code':400,
            'msg':'未发送验证码'
        })
    }
}


module.exports={
    sendCode,
    codePhoneLogin
}

