require(['config'], function() {
    require(['jquery', 'jq_lazyload'], function() {
        ! function($) {
            const list = $('.list-content ul');
            $.ajax({ //获取远程接口的值
                url: 'http://192.168.11.3/JS2008/yaoyaoyao/php/piclistmain.php',
                dataType: 'json'
            }).done(function(data) {
                // console.log(data);
                let strhtml = '';
                $.each(data, function(index, value) { //遍历数组和对象
                    strhtml += `
                    <li>
                    <div class="yagao">
                    <a href="javascript:;"><img class="lazy" data-original="${value.url}" alt=""></a>
                    <p class="y-price"><span>${value.price}</span></p>
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
            })
        }(jQuery);
    })
})