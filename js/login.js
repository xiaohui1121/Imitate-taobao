// 获取dom元素
// 密码、短信 tab 栏
let pwd_msg = document.querySelector('div[class~="pwd_msg"]');
// 密码、短信 tab
let pwdTab = document.querySelector('#pwd-tab');
let msgTab = document.querySelector('#msg-tab');
// 扫码界面标题
let smTab = document.querySelector('div[class~="saoma"]');
// 密码、短信、扫码 表单面板
let loginPwd = document.querySelector('div[class~="login-pwd"]');
let loginMsg = document.querySelector('div[class~="login-msg"]');
let scanCode = document.querySelector('div[class~="scan-code"]');
// 右上角切换
let switchQrcode = document.querySelector('.switch-qrcode');
// 匹配所有表单面板
let loginSwitch = document.querySelectorAll('div[class~="login-switch"]');
let loginSwitchTab = document.querySelectorAll('div[class~="login-switch-tab"]');
// 扫码登录提示
let poptip = document.querySelector('.poptip');
// 二维码失效遮罩
let mask = document.querySelector('.mask');
// 刷新二维码按钮
let refreshBtn = document.querySelector('.refresh');


// 定义常量
// 二维码失效时间，单位 s
const FAILURE_TIME = 5;
// 测试的对应账号、密码
const USER = 'admin';
const PASSWORD = '81dc9bdb52d04dc20036dbd8313ed055';  // 1234  经过 md5 加密
// 测试的短信验证的手机号、验证码、验证码重发间隔，单位 s
const TEL_NUMBER = '15297715740';
const YZ_CODE = '1234';
const INTERVAL_TIME = 45;



// 密码登录校验
let pwdLoginBtn = document.querySelector('#pwd-login');
let errTip = document.querySelector('.errTip');
let errTipInfo = document.querySelector('#errTipInfo');
pwdLoginBtn.addEventListener('click', function (e) {
    // 阻止默认提交行为
    e.preventDefault();
    // 收集表单数据
    let user = pwdform.loginId.value.trim();
    let pwdIpt = pwdform.loginPwd.value.trim();
    // 校验合法性
    // 不能为空
    if (user.length === 0) return errTipMsg('请输入手机号码');
    // 用户名、邮箱号、手机号合法性
    if (!(checkUser(user) || checkEmail(user) || checkMobile(user))) return errTipMsg('会员名/邮箱/手机号不合法')
    // 用户名合法，判断有无密码
    if (pwdIpt.length === 0) return errTipMsg('请输入密码');
    // 密码加密
    let pwd = calcMD5(pwdform.loginPwd.value.trim());  // md5 算法加密
    // 比对密码
    if (pwd !== PASSWORD || user !== USER) return errTipMsg('账号名或登录密码不正确')
    let timer = setTimeout(() => {
        errTipMsg('成功');
        clearTimeout(timer);
    }, 1000);
})
// 短信登录校验
let msgLoginBtn = document.querySelector('#msg-login');
let sendMsg = document.querySelector('#sendMsg');
// 存储是否发送了验证码
let sendFlag = false;
// 短信登录点击事件
msgLoginBtn.onclick = function (e) {
    // 阻止浏览器默认提交行为
    e.preventDefault();
    // 获取myform表单中的数据
    let telPre = msgform.telPre.value.trim();
    // 收集表单数据
    let telNumber = msgform.msgLoginId.value.trim();
    let yzCode = msgform.msgLoginYzm.value.trim();

    // 简单的手机号码验证逻辑
    if (!telNumber) return errTipMsg('请输入手机号码')
    if (!checkMobile(telNumber)) return errTipMsg('手机号码格式不正确，请重新输入')

    // 判断验证码是否有效
    if (!sendFlag) return errTipMsg('请先发送验证码')
    // 判断表单信息，校验验证码
    if (!(telPre && telNumber === TEL_NUMBER && yzCode === YZ_CODE)) return errTipMsg('短信验证码错误或已失效，请重新获取')

    // 成功，调用api进行注册操作
    errTipMsg('登录成功！')
}
// 发送验证码事件
function sendMsgEvent() {
    // 简单的手机号码验证逻辑
    let telNumber = msgform.msgLoginId.value.trim();
    if (!telNumber) return errTipMsg('请输入手机号码')
    if (!checkMobile(telNumber)) return errTipMsg('手机号码格式不正确，请重新输入')
    // 通过电话号码简单验证
    // 解绑事件，防止重复点击发送
    sendMsg.onclick = false;
    sendFlag = true;
    // 设置发送验证码间隔
    let t = INTERVAL_TIME;
    let timer = setInterval(() => {
        sendMsg.innerHTML = `重发验证码(${t} s)`
        if (t === 0) {
            sendMsg.innerHTML = '获取验证码'
            clearInterval(timer)
            // 重新绑定事件
            sendMsg.onclick = sendMsgEvent;
            // 验证码过期
            sendFlag = false;
        }
        t--;
    }, 1000);
}
// 绑定发送验证码
sendMsg.onclick = sendMsgEvent;


// 面板切换
// 密码登录和短信登录面板切换
pwdTab.onclick = initPanel;
msgTab.onclick = function () {
    addAtr(this, 'current');
    removeAtr(pwdTab, 'current');
    removeAtr(loginMsg, 'hide');
    addAtr(loginPwd, 'hide');
}
// 切换扫码登录
let flag = 'qrcode';
switchQrcode.onclick = function () {
    // 让所有界面隐藏
    addAtr(loginSwitch, 'hide')
    // 判断当前是 表单登录界面 还是 扫码登录界面
    if (flag === 'qrcode') {
        // 切换到扫码登录界面
        removeAtr([scanCode, smTab], 'hide')
        addAtr([poptip, pwd_msg], 'hide')
        // 更换图标
        changeAtr(this.children[0], 'icon-qrcode', 'icon-pc')
        flag = 'pc';
        // 定时器，二维码失效，显示遮罩
        let timer = setTimeout(() => {
            isMaskShow(true);
            clearTimeout(timer);
        }, FAILURE_TIME * 1000);
    } else {
        // 初始化为初始登录界面
        initPanel()
        addAtr(smTab, 'hide')
        removeAtr([pwd_msg, poptip], 'hide')
        // 更换图标
        changeAtr(this.children[0], 'icon-pc', 'icon-qrcode')
        flag = 'qrcode';
    }
}
// 二维码失效刷新
refreshBtn.addEventListener('click', () => {
    isMaskShow(false);
    // 定时器，二维码失效，显示遮罩
    let timer = setTimeout(() => {
        isMaskShow(true);
        clearTimeout(timer);
    }, FAILURE_TIME * 1000);
})




// 自定义函数方法
// 二维码失效遮罩
function isMaskShow(choose) {
    // 显示遮罩
    if (choose) {
        removeAtr(mask, 'hide');
        return
    }
    // 隐藏遮罩
    addAtr(mask, 'hide')
}
// 界面初始化显示在 密码登录界面
function initPanel() {
    removeAtr([pwdTab, msgTab], 'current');
    addAtr(pwdTab, 'current');
    addAtr(loginSwitch, 'hide');
    removeAtr(loginPwd, 'hide');
}
// 批量移除classLisst属性值
function removeAtr(eles, atrName) {
    // 判断对象是否可以迭代
    if (typeof eles[Symbol.iterator] === 'function') {
        // 让所有界面显示
        for (let ele of eles) {
            ele.classList.remove(atrName)
        }
        return
    }
    eles.classList.remove(atrName)
}
// 批量添加classLisst属性值
function addAtr(eles, atrName) {
    if (typeof eles[Symbol.iterator] === 'function') {
        // 让所有界面隐藏
        for (let ele of eles) {
            ele.classList.add(atrName)
        }
        return
    }
    eles.classList.add(atrName)
}
// 批量更换classLisst属性值
function changeAtr(eles, oldAtrName, newAtrName) {
    if (typeof eles[Symbol.iterator] === 'function') {
        // 让所有属性更换
        for (let ele of eles) {
            ele.classList.remove(oldAtrName)
            ele.classList.add(newAtrName)
        }
        return
    }
    eles.classList.remove(oldAtrName)
    eles.classList.add(newAtrName)
}
// 邮箱验证
function checkEmail(str) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (re.test(str)) return true;
    return false;
}
// 手机号验证
function checkMobile(str) {
    var re = /^1\d{10}$/
    if (re.test(str)) return true;
    return false;
}
// 账号验证
function checkUser(str) {
    var re = /^[a-zA-z]\w{3,15}$/
    if (re.test(str)) return true;
    return false;
}
// errTip 不正当提示  参数：内容
function errTipMsg(msg) {
    errTip.style.display = 'block';
    errTipInfo.innerHTML = msg;
    let timer = setTimeout(() => {
        errTip.style.display = 'none';
        clearTimeout(timer);
    }, 2000);
}