// 存储是否发送了验证码
let sendFlag = false;
// 定义一个验证码，做校验测试
const YZ_CODE = '1234';
// 设置重新发送验证码间隔，单位 s
const INTERVAL_TIME = 45;


// 获取dom元素
let regBtn = document.querySelector('.regBtn');
let xyIpt = document.querySelector('#xy-checkbox');
let confirmBtn = document.querySelector('#confirm');
let sendMsg = document.querySelector('#sendmsg');
let errTip = document.querySelector('.errTip')
let errTipInfo = document.querySelector('#errTipInfo')
let yzIpt = document.querySelector('#yz-code')
let telIpt = document.querySelector('#tel-number');


window.addEventListener('load', function () {
    // 注册按钮点击事件
    regBtn.onclick = function (e) {
        // 阻止浏览器默认提交行为
        e.preventDefault();
        // 获取myform表单中的数据
        let telPre = myform.telPre.value.trim();
        let telNumber = myform.telNumber.value.trim();
        let yzCode = myform.yzCode.value.trim();

        // 如果勾选协议，直接return出去，否则显示提示
        if (!xyIpt.checked) {
            errTipMsg('请阅读并同意协议')
            return
        }
        // 判断验证码是否有效
        if (!sendFlag) {
            errTipMsg('请先发送验证码')
            return
        }
        // 判断表单信息，校验验证码
        if (!(telPre && telNumber && yzCode === YZ_CODE)) {
            errTipMsg('校验码不正确，请重新输入')
            return
        }
        // 成功，调用api进行注册操作
        errTipMsg('注册成功！')
    }

    // 只有在验证码和电话号码同时有值时，注册按钮才能用
    yzIpt.onkeyup = check;
    telIpt.onkeyup = check;

    // 绑定发送验证码
    sendMsg.onclick = sendMsgEvent;

})

// 绑定事件
// 发送验证码事件
function sendMsgEvent() {
    let telNumber = myform.telNumber.value.trim();
    if (!telNumber) return
    // 简单的验证逻辑
    if (!isMobil(telNumber)) {
        errTipMsg('手机号码格式不正确，请重新输入')
        return
    }
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


// errTip 不正当提示  参数：内容
function errTipMsg(msg) {
    errTip.style.display = 'block';
    errTipInfo.innerHTML = msg;
    let timer = setTimeout(() => {
        errTip.style.display = 'none';
        clearTimeout(timer);
    }, 2000);
}

//手机号码验证信息
function isMobil(s) {
    var patrn = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
    if (!patrn.exec(s)) {
        return false;
    } return true;
}

// 监听验证码输入框
function check() {
    let telNumber = myform.telNumber.value.trim();
    let yzCode = myform.yzCode.value.trim();
    if (!(telNumber && yzCode)) {
        // 禁用注册按钮
        regBtn.disabled = true;
        regBtn.style.backgroundImage = ''
        return
    }
    // 解禁注册按钮
    regBtn.disabled = false;
    regBtn.style.backgroundImage = 'linear-gradient(90deg, #f90, #ff5000)';
}
