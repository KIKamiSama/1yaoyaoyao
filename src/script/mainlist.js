require(['config'], function() {
    require(['jquery', 'jq_lazyload', 'jq_pagination'], function() {
        ! function($) {
            //排序
            let array_default = []; //排序前的li数组
            let array = []; //排序中的数组
            //冒泡排序，比较相邻的两个数字。
            let prev = null; //前一个商品价格
            let next = null; //后一个商品价格
            // //1.渲染列表页的数据-默认渲染第一页
            const list = $('.list-content ul');
            $.ajax({ //获取远程接口的值
                    url: 'http://192.168.11.3/JS2008/yaoyaoyao/php/listdata.php',
                    dataType: 'json'
                }).done(function(data) {
                    // console.log(data);
                    let strhtml = '';
                    $.each(data, function(index, value) { //遍历数组和对象
                        strhtml += `
                    <li>
                    <div class="yagao">
                    <a href="javascript:;"><img class="lazy" data-original="${value.url}" alt=""></a>
                    <p class="y-price"><span id="pp">￥${value.price}</span></p>
                    <p class="title-box">
                        <a href="">
                            <span class="list-self"></span>${value.title}
                        </a>
                        <a href="" class="promotitle">${value.promotitle}
                    </p>
                    <div class="sell-type">
                        <span class="type-right">
                            <a href="">评论<em>${value.tell}</em>条</a>
                        </span>
                        <span class="type-left">1药网自营</span>
                    </div>
                    <div class="buycaradd">
                        <input type="button" class="buyreduce">
                        <input type="text" class="buynum" value="1">
                        <input type="button" class="buyadd">
                        <button class="buy">加入购物车</button>
                    </div>
                </div>
                </li>
                    `;
                    });
                    list.html(strhtml); //追加数据
                    //实现懒加载效果
                    $("img.lazy").lazyload({
                        effect: "fadeIn" //图片显示方式
                    });

                    //排序
                    array_default = []; //排序前的li数组
                    array = []; //排序中的数组
                    //冒泡排序，比较相邻的两个数字。
                    prev = null; //前一个商品价格
                    next = null; //后一个商品价格
                    $('.list-content ul li').each(function(index, element) {
                        array[index] = $(this);
                        array_default[index] = $(this);
                    });
                })
                //2.分页思路:根据传输的页码，后端返回对应的接口数据，渲染出来。
            $('.page').pagination({
                pageCount: 3, //总的页数
                jump: true, //是否开启跳转到指定的页数，布尔值。
                prevContent: '上一页', //将图标改成上一页下一页。
                nextContent: '下一页',
                callback: function(api) {
                    console.log(api.getCurrent()); //获取当前的点击的页码。
                    $.ajax({
                        url: 'http://192.168.11.3/JS2008/yaoyaoyao/php/listdata.php',
                        data: {
                            page: api.getCurrent() //传输数据
                        },
                        dataType: 'json'
                    }).done(function(data) {
                        let $strhtml = '<ul>';
                        $.each(data, function(index, value) {
                            $strhtml += `
                    <li>
                    <div class="yagao">
                    <a href="javascript:;"><img class="lazy" data-original="${value.url}" alt=""></a>
                    <p class="y-price"><span id="pp">￥${value.price}</span></p>
                    <p class="title-box">
                        <a href="">
                            <span class="list-self"></span>${value.title}
                        </a>
                        <a href="" class="promotitle">${value.promotitle}
                    </p>
                    <div class="sell-type">
                        <span class="type-right">
                            <a href="">评论<em>${value.tell}</em>条</a>
                        </span>
                        <span class="type-left">1药网自营</span>
                    </div>
                    <div class="buycaradd">
                        <input type="button" class="buyreduce">
                        <input type="text" class="buynum" value="1">
                        <input type="button" class="buyadd">
                        <button class="buy">加入购物车</button>
                    </div>
                </div>
                    </li>
                `;
                        });
                        $strhtml += '</ul>';
                        list.html($strhtml);
                        //实现懒加载效果
                        $("img.lazy").lazyload({
                            effect: "fadeIn" //图片显示方式
                        });

                        array_default = []; //排序前的li数组
                        array = []; //排序中的数组
                        //冒泡排序，比较相邻的两个数字。
                        prev = null; //前一个商品价格
                        next = null; //后一个商品价格
                        //将页面的li元素加载到两个数组中
                        $('.list-content li').each(function(index, element) {
                            array[index] = $(this);
                            array_default[index] = $(this);
                        });
                    });
                }

            });

            //3.排序，排序前的数组都已经具有li元素
            // 默认
            $('.normal .jiage').eq(0).on('click', function() {
                $.each(array_default, function(index, value) {
                    $('.list-content ul').append(value);
                });
                return;
            });
            // 升序
            $('.normal .jiage').eq(1).on('click', function() {
                for (let i = 0; i < array.length - 1; i++) {
                    for (let j = 0; j < array.length - i - 1; j++) {
                        prev = parseFloat(array[j].find('#pp').html().substring(1)); //取上个价格
                        next = parseFloat(array[j + 1].find('#pp').html().substring(1)); //下一个的价格
                        //通过价格的判断，改变的是数组li的位置。
                        if (prev > next) {
                            let temp = array[j];
                            array[j] = array[j + 1];
                            array[j + 1] = temp;
                        }
                    }
                }
                $('.list-content ul').empty();
                $.each(array, function(index, value) {
                    $('.list-content ul').append(value);
                });
            });

            // 降序
            $('.normal .jiage').eq(2).on('click', function() {
                for (let i = 0; i < array.length - 1; i++) {
                    for (let j = 0; j < array.length - i - 1; j++) {
                        prev = parseFloat(array[j].find('#pp').html().substring(1)); //取上个价格
                        next = parseFloat(array[j + 1].find('#pp').html().substring(1)); //下一个的价格
                        //通过价格的判断，改变的是数组li的位置。
                        if (prev < next) {
                            let temp = array[j];
                            array[j] = array[j + 1];
                            array[j + 1] = temp;
                        }
                    }
                }
                $('.list-content ul').empty();
                $.each(array, function(index, value) {
                    $('.list-content ul').append(value);
                });
            });
        }(jQuery);
    })
})