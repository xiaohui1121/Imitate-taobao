// 定义搜索页面的初始路径
const BASE_SEARCH_PATH = './templates/search.html';


// 页面加载完毕后执行
window.addEventListener('load', function () {
    // swiper插件中的轮播图效果
    // banner
    let swiper = new Swiper(".mySwiper", {
        // 自动轮播
        autoplay: {
            delay: 2500,  // 间隔事件
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
    // mod
    let swiper2 = new Swiper(".mySwiper-mod", {
        pagination: {
            el: ".swiper-pagination",
            type: "fraction",
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        // 循环播放
        loop: true,
        // 自动轮播
        autoplay: true,
    });



    // 顶部的固定搜索、右侧的工具条
    // 获取元素
    let fixedSearch = document.querySelector('.fixed-search');
    let tool = document.querySelector('#tool');
    let toolLis = document.querySelectorAll('#tool li');
    // 监听窗口页面滚动事件
    window.addEventListener('scroll', function (e) {
        let topPX = getScroll().top;
        // 顶部固定搜索框
        if (topPX >= 114) {
            fixedSearch.style.display = 'block';
        } else {
            fixedSearch.style.display = 'none';
        }
        // 右侧电梯导航固定
        if (topPX >= 460) {
            tool.classList.add('posChange');
        } else {
            tool.classList.remove('posChange');
        }
        // 有好货  693px
        if (topPX >= 1050) {
            // 猜你喜欢  1050px
            for (let i = 0; i < toolLis.length; i++) {
                toolLis[i].className = '';
            }
            toolLis[1].className = 'current';
        } else {
            for (let i = 0; i < toolLis.length; i++) {
                toolLis[i].className = '';
            }
            toolLis[0].className = 'current';
        }
        // 返回顶部显示
        if (topPX >= 731) {
            toolLis[2].style.display = 'block';
        } else {
            toolLis[2].style.display = 'none';
        }
    })
    // 返回顶部
    toolLis[2].addEventListener('click', function (e) {
        animate(window, 0, function () {
            console.log('回到了顶部')
        })
    })
    // 获取页面被卷去部分的像素,兼容性解决方案
    function getScroll() {
        return {
            left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
            top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        };
    }


    // 获取a链接跳转的请求参数
    let als = document.querySelectorAll('.screen-outer .left a');
    let a_hotls = document.querySelectorAll('.search-hot a');
    aParameter(als, '_blank')
    aParameter(a_hotls, '_blank')


    // 进行搜索
    let searchBtn = document.querySelectorAll('.search-btn');
    // 点击搜索键进行搜索
    for (let i = 0; i < searchBtn.length; i++) {
        searchBtn[i].addEventListener('click', function () {
            let iptNode = this.previousElementSibling.children[0];
            let iptVal = iptNode.value.trim();
            // 判断是否输入内容，没有就将placeholder值传入
            if (!iptVal) iptVal = iptNode.placeholder;
            // 清空输入框
            iptNode.value = '';
            // 页面跳转搜索页
            window.location.assign(BASE_SEARCH_PATH + '?q=' + iptVal);
        })
    }
    // 输入框按下回车触发搜索
    let ipt = document.querySelectorAll('.input input');
    for (let i = 0; i < ipt.length; i++) {
        ipt[i].addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                this.parentNode.nextElementSibling.click()
            }
        })
    }











})


// 定义给a链接自动拼接参数，并跳转链接事件
// 参数: 1.dom元素  2.打开方式（_self 覆盖 / _blank新页面）
function aParameter(tags) {
    let openWay = arguments.length > 1 ? arguments[1] : '_self';
    for (let i = 0; i < tags.length; i++) {
        tags[i].addEventListener('click', function (e) {
            // 阻止a标签的默认跳转
            e.preventDefault();
            // 拼接新的 链接
            let newPath = BASE_SEARCH_PATH + '?q=' + this.innerText;
            // 判断打开链接的方式
            if (openWay === '_self') {
                window.location.href = newPath;
            } else if (openWay === '_blank') {
                // 在新页面打开链接
                window.open(newPath);
            }
        })
    }
}



// 自定义缓慢动画，实现缓慢过渡效果
function animate(obj, target, callback) {
    // 先清除以前的定时器，只保留当前的一个定时器执行
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        // 步长值写到定时器的里面
        // 把我们步长值改为整数 不要出现小数的问题
        var step = (target - window.pageYOffset) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (window.pageYOffset == target) {
            // 停止动画 本质是停止定时器
            clearInterval(obj.timer);
            // 回调函数写到定时器结束里面
            callback && callback();
        }
        // 把每次加1 这个步长值改为一个慢慢变小的值,实现缓慢动画
        // 步长公式：(目标值 - 现在的位置) / 10
        // obj.style.left = obj.offsetLeft + step + 'px';
        window.scroll(0, window.pageYOffset + step);
    }, 15);
}