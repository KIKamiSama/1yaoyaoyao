require(['config'], function() {
    require(['jquery', 'jq_lazyload'], function() {
        ! function($) {
            const list = $('.floor-list');
            $.ajax({ //获取远程接口的值
                url: 'http://192.168.11.3/JS2008/yaoyaoyao/php/piclist.php',
                dataType: 'json'
            }).done(function(data) {
                // console.log(data);
                let strhtml = '';
                $.each(data, function(index, value) { //遍历数组和对象
                    strhtml += `
                    <a href="detail.html?sid=${value.sid}">
                        <li>
                            <img class="lazy" data-original="${value.url}" width="200" height="200" >
                            <a>${value.title}</a>
                            <p><i>¥</i>${value.price}</p>
                        </li>
                    </a>
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