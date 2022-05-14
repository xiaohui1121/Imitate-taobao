window.addEventListener('load', function () {
    // 获取url携带过来的参数
    let searchVal = document.querySelectorAll('.searchVal');
    let search = window.location.search;
    let params = decodeURIComponent(window.location.search).split('?q=')[1];
    if (search) {
        for (let i = 0; i < searchVal.length; i++) {
            searchVal[i].value = params
        }
    }




    // 为筛选条件 tab 切换 绑定事件
    let filter = document.querySelectorAll('.filter a');
    let filterItem = document.querySelectorAll('.filter-item');
    for (let i = 0; i < filter.length; i++) {
        // 鼠标进入显示
        filter[i].addEventListener('mouseover', function (e) {
            let index = this.parentNode.getAttribute('data-index')
            filterItem[index].style.display = 'block';
        });
        // 鼠标移出隐藏
        filter[i].addEventListener('mouseleave', function (e) {
            let index = this.parentNode.getAttribute('data-index')
            filterItem[index].style.display = 'none';
        })
    }


    // 价格排序
    let priceOpetion = document.querySelector('.price-opetion');
    let priceTab = document.querySelector('#price');
    priceTab.addEventListener('mouseover', function () {
        priceOpetion.style.display = 'block';
    })
    priceTab.addEventListener('mouseleave', function () {
        priceOpetion.style.display = 'none';
    })

    // 价格区间输入获得焦点显示
    let priceRange = document.querySelector('.priceRange');
    let priceRangeBtn = document.querySelector('.priceRangeBtn');
    let iptArea = document.querySelector('.priceRange ul');

    iptArea.addEventListener('mouseover', function (e) {
        priceRange.classList.remove('onfocus');
        priceRangeBtn.classList.remove('hide');
        priceRange.style.zIndex = 1;
    })

    iptArea.addEventListener('mouseleave', function (e) {
        priceRange.classList.add('onfocus');
        priceRangeBtn.classList.add('hide');
        priceRange.style.zIndex = 0;
    })

    // 价格区间的柱状图显示
    let pop = document.querySelector('.tab-sort .pop');
    let popInfo = pop.children[0];
    let priceBars = document.querySelectorAll('.priceBar a');

    for (let i = 0; i < priceBars.length; i++) {
        priceBars[i].addEventListener('mouseover', function () {
            let percent = this.children[0].style.height;
            popInfo.innerHTML = `${percent}用户喜欢的价位`;
            pop.style.display = 'block';
            pop.style.left = `${123 + i * 15}px`;
        })
        priceBars[i].addEventListener('mouseleave', function () {
            pop.style.display = 'none';
        })
    }

    // 顶部的固定搜索、右侧的工具条
    // 获取元素
    let fixedSearchShow = true;
    let fixedSearch = document.querySelector('.fixed-search');
    let goUp = document.querySelector('.goUp');
    console.log(goUp)
    // 监听窗口页面滚动事件
    window.addEventListener('scroll', function (e) {
        let topPX = getScroll().top;
        console.log(topPX)
        // 顶部固定搜索框
        if (topPX >= 150 && fixedSearchShow) {
            fixedSearch.style.display = 'block';
        } else {
            fixedSearch.style.display = 'none';
        }
        // 返回顶部显/隐
        if (topPX >= 930) {
            goUp.style.display = 'block';
        } else {
            goUp.style.display = 'none';
        }
    })

    // 返回顶部
    goUp.addEventListener('click', function (e) {
        animate(window, 0)
    })

    // 点击关闭固定搜索
    let closeBtn = fixedSearch.querySelector('.close');
    closeBtn.addEventListener('click', function () {
        fixedSearchShow = false;
        fixedSearch.style.display = 'none';
    })

    // 获取页面被卷去部分的像素,兼容性解决方案
    function getScroll() {
        return {
            left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
            top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        };
    }




    // 使用layui 开发的分页器
    layui.use('laypage', function () {
        let laypage = layui.laypage;
        //完整功能
        laypage.render({
            elem: 'paging',
            count: 1000,
            layout: ['prev', 'page', 'next', 'count', 'skip'],
            // jump: function (obj) {
            //     console.log(obj)
            // }, // 跳转页面的回调函数
            theme: '#ff4400',
            // theme: 'theme',  // 对应的 layui-laypage-xxx  类名
            prev: '<i class="iconfont icon-fanhui"></i>上一页',
            next: '下一页<i class="iconfont icon-gengduo"></i>',
        });
    });



})


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