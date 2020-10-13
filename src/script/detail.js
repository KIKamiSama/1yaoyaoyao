require(['config'], function() {
    require(['jquery', 'jq_lazyload', 'jq_cookie'], function() {
        ! function($) {
            //1.获取列表页传来的sid
            let $sid = location.search.substring(1).split('=')[1];

            const $smallpic = $('.imgkk img');
            const $bpic = $('.bf img');
            const $title = $('.propoty h1');
            const $price = $('.d-price');

            //如果$sid不存在，默认$sid = 1
            if (!$sid) {
                $sid = 1;
            }

            //2.将sid传给后端
            $.ajax({
                url: 'http://192.168.11.3/JS2008/yaoyaoyao/php/getsiddetail.php',
                data: {
                    datasid: $sid
                },
                dataType: 'json'
            }).done(function(d) {
                // console.log(d);
                $smallpic.attr('src', d.url);
                $smallpic.attr('sid', d.sid); //给图片添加唯一的sid
                $bpic.attr('src', d.url);
                $title.html(d.title);
                $price.html(d.price);
                //渲染小图
                let picarr = d.urllist.split(',');
                let $strhtml = '';
                $.each(picarr, function(index, value) {
                    $strhtml += '<li><img src="' + value + '"/></li>';
                });
                $('.ulist ul').html($strhtml);
            });

            //3.放大镜效果
            const $spic = $('.imgkk');
            const $sf = $('.sf'); //小放
            const $bf = $('.bf'); //大放
            const $left = $('#ll'); //左箭头
            const $right = $('#rr'); //右箭头
            const $list = $('.ulist ul'); //小图列表
            //$spic 小图   $bpic 大图  

            //小放/大放=小图/大图
            $sf.width($spic.width() * $bf.width() / $bpic.width());
            $sf.height($spic.height() * $bf.height() / $bpic.height());
            let $bili = $bpic.width() / $spic.width(); //比例大于1 放大效果


            $spic.hover(function() {
                $sf.css('visibility', 'visible');
                $bf.css('visibility', 'visible');
                $(this).on('mousemove', function(ev) {
                    let $leftvalue = ev.pageX - $('.box').offset().left - $sf.width() / 2;
                    let $topvalue = ev.pageY - $('.box').offset().top - $sf.height() / 2;
                    if ($leftvalue < 0) {
                        $leftvalue = 0;
                    } else if ($leftvalue >= $spic.width() - $sf.width()) {
                        $leftvalue = $spic.width() - $sf.width()
                    }

                    if ($topvalue < 0) {
                        $topvalue = 0;
                    } else if ($topvalue >= $spic.height() - $sf.height()) {
                        $topvalue = $spic.height() - $sf.height()
                    }

                    $sf.css({
                        left: $leftvalue,
                        top: $topvalue
                    });

                    $bpic.css({
                        left: -$leftvalue * $bili,
                        top: -$topvalue * $bili
                    });

                });
            }, function() {
                $sf.css('visibility', 'hidden');
                $bf.css('visibility', 'hidden');
            });

            //小图切换
            $('.ulist ul').on('click', 'li', function() {
                //$(this):当前操作的li
                let $imgurl = $(this).find('img').attr('src');
                $smallpic.attr('src', $imgurl);
                $bpic.attr('src', $imgurl);
            });

            //左右箭头事件
            let $num = 6; //列表显示的图片个数
            $right.on('click', function() {
                let $lists = $('.ulist ul li');
                if ($lists.size() > $num) { //限制点击的条件
                    $num++;
                    $left.css('color', '#333');
                    if ($lists.size() == $num) {
                        $right.css('color', '#fff');
                    }
                    $('.ulist ul').animate({
                        left: -($num - 6) * $lists.eq(0).outerWidth(true)
                    });
                }
            });


            $left.on('click', function() {
                let $lists = $('.ulist ul li');
                if ($num > 6) { //限制点击的条件
                    $num--;
                    $right.css('color', '#333');
                    if ($num <= 6) {
                        $left.css('color', '#fff');
                    }
                    $('.ulist ul').animate({
                        left: -($num - 6) * $lists.eq(0).outerWidth(true)
                    });
                }
            });

            //购物车的注意事项
            //1.购物车的核心存储什么：
            //商品的编号：
            //商品的数量：

            //2.怎么存储--数组
            let arrsid = []; //存储商品的编号。
            let arrnum = []; //存储商品的数量。
            //3.点击加入购物车按钮(确定是第一次点击还是多次点击)
            //第一次点击：在购物车列表页面创建商品列表
            //多次点击：之前创建过商品列表，只需要数量增加。

            //取出cookie,才能判断是第一次还是多次点击
            function getcookie() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) { //cookie存在
                    arrsid = $.cookie('cookiesid').split(','); //获取cookie的sid，存放到数组中。
                    arrnum = $.cookie('cookienum').split(','); //获取cookie的数量，存放到数组中。
                } else { //cookie不存在
                    arrsid = [];
                    arrnum = [];
                }
            }



            // $('.cart-btn').on('click', function() {
            //     //获取当前商品对应的sid
            //     let $sid = $(this).parents('.box').find('.imgkk img').attr('sid');
            //     //判断是第一次点击还是多次点击
            //     //多次点击
            //     //$.inArray(value,array,[fromIndex])
            //     //确定第一个参数在数组中的位置，从0开始计数(如果没有找到则返回 -1 )。
            //     getcookie();
            //     if ($.inArray($sid, arrsid) != -1) { //$sid存在，商品列表存在，数量累加
            //         //先取出cookie中存在的数量+当前添加的数量，一起添加到cookie中。
            //         let $num = parseInt(arrnum[$.inArray($sid, arrsid)]) + parseInt($('.num-con').val()); //取值
            //         arrnum[$.inArray($sid, arrsid)] = $num; //赋值
            //         jscookie.add('cookienum', arrnum, 10);
            //     } else {
            //         //第一次点击加入购物车按钮,将商品的sid和商品的数量放到提前准备的数组里面，然后将数组传入cookie.
            //         arrsid.push($sid); //将编号$sid push到arrsid数组中
            //         jscookie.add('cookiesid', arrsid, 10);
            //         arrnum.push($('.num-con').val()); //将数量push到arrnum数组中
            //         jscookie.add('cookienum', arrnum, 10);
            //     }
            //     alert('按钮触发了');
            // });



            $('.cart-btn').on('click', function() {
                getcookie(); //如果cookie存在，取到cookie的值，并且变成了数组。
                // let $sid = $(this).parents('.box').find('.imgkk img').attr('sid');
                let $sid = $('.imgkk img').attr('sid');
                console.log($sid);
                //如果arrsid里面存在当前商品的sid，说明商品已经存在，否则商品是第一次购买。
                //$.inArray(value,array)确定第一个参数在数组中的位置，从0开始计数(如果没有找到则返回 -1 )。
                //alue:查找的值
                //array:数组
                if ($.inArray($sid, arrsid) === -1) { //不存在，将商品的sid和数量存入cookie
                    arrsid.push($sid); //添加当前商品的sid
                    $.cookie('cookiesid', arrsid, { expires: 10, path: '/' }); //插件完成的cookie的添加。
                    arrnum.push($('.num-con').val()); //添加商品的数量
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' }); //插件完成的cookie的添加。
                } else { //存在,商品的数量累加
                    //获取原来的sid对应的数量(sid和数量是对应的 ，sid的在数组的位置就是数量在数组的位置)
                    let index = $.inArray($sid, arrsid); //sid在数组中的位置
                    let num = parseInt(arrnum[index]); //sid对应的数量
                    //原来的数量+新添加数量，一起存入cookie
                    arrnum[index] = num + parseInt($('.num-con').val()); //原来的数量+新添加数量进行赋值
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' }); //一起存入cookie
                }

                alert('按钮被点击了');


            });

        }(jQuery);
    })
})