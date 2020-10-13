require(['config'], function() {
    require(['jquery', 'jq_cookie'], function() {
        ! function($) {
            //1.获取cookie渲染对应的商品列表
            //2.获取所有的接口数据，判断取值。

            function showlist(sid, num) { //sid：编号  num：数量
                $.ajax({
                    url: 'http://192.168.11.3/JS2008/yaoyaoyao/php/piclistmain.php',
                    dataType: 'json'
                }).done(function(data) {
                    $.each(data, function(index, value) {
                        if (sid == value.sid) {
                            let $clonebox = $('.kboth:hidden').clone(true, true); //克隆隐藏元素
                            $clonebox.find('.item-mes').find('img').attr('src', value.url);
                            $clonebox.find('.item-mes').find('img').attr('sid', value.sid);
                            $clonebox.find('.item-mes').find('span').html(value.title);
                            $clonebox.find('.item-price').find('span').html(value.price);
                            $clonebox.find('.num-box').find('.num-text').val(num);
                            //计算单个商品的价格
                            $clonebox.find('.item-tol').find('span').html((value.price * num).toFixed(2));
                            $clonebox.css('display', 'block');
                            $('.body-item').append($clonebox);
                            calcprice(); //计算总价
                        }
                    });
                });
            }

            //2.获取cookie渲染数据
            if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                let s = $.cookie('cookiesid').split(','); //获取cookie 同时转换成数组[1,2]
                let n = $.cookie('cookienum').split(','); //获取cookie 同时转换成数组[10,20]
                $.each(s, function(index, value) {
                    showlist(s[index], n[index]);
                });
            }

            //3.计算总价--使用次数很多--函数封装
            function calcprice() {
                let $sum = 0; //商品的件数
                let $count = 0; //商品的总价
                $('.kboth:visible').each(function(index, ele) {
                    if ($(ele).find('.check').prop('checked')) { //复选框勾选
                        $sum += parseInt($(ele).find('.num-text').val());
                        $count += parseFloat($(ele).find('.item-tol span').html());
                    }
                });
                $('.zongshu').find('em').html($sum);
                $('.zongjia').html($count.toFixed(2));
            }

            //4.全选
            $('.quanxuan input').on('change', function() {
                $('.kboth:visible').find(':checkbox').prop('checked', $(this).prop('checked'));
                $('.quanxuan').prop('checked', $(this).prop('checked'));
                calcprice(); //计算总价
            });
            let $inputs = $('.kboth:visible').find(':checkbox');
            $('.body-item').on('change', $inputs, function() {
                //$(this):被委托的元素，checkbox
                if ($('.kboth:visible').find(':checkbox').length === $('.kboth:visible').find('input:checked').size()) {
                    $('.quanxuan input').prop('checked', true);
                } else {
                    $('.quanxuan input').prop('checked', false);
                }
                calcprice(); //计算总价
            });

            //5.数量的改变
            $('.num-add').on('click', function() {
                console.log(1);
                let $num = $(this).parents('.num-box').find('.num-text').val();
                $num++;
                $(this).parents('.num-box').find('.num-text').val($num);

                $(this).parents('.goods').find('.zongshu span').html(calcsingleprice($(this)));
                calcprice(); //计算总价
                setcookie($(this));
            });


            $('.num-reduce').on('click', function() {
                console.log(2);
                let $num = $(this).parents('.num-box').find('.num-text').val();
                $num--;
                if ($num < 1) {
                    $num = 1;
                }
                $(this).parents('.num-box').find('.num-text').val($num);
                $(this).parents('.goods').find('.zongshu span').html(calcsingleprice($(this)));
                calcprice(); //计算总价
                setcookie($(this));
            });


            $('.num-text').on('input', function() {
                let $reg = /^\d+$/g; //只能输入数字
                let $value = $(this).val();
                if (!$reg.test($value)) { //不是数字
                    $(this).val(1);
                }
                $(this).parents('.goods-item').find('.b-sum strong').html(calcsingleprice($(this)));
                calcprice(); //计算总价
                setcookie($(this));
            });

            //计算单价
            function calcsingleprice(obj) { //obj元素对象
                let $dj = parseFloat(obj.parents('.goods-item').find('.b-price strong').html());
                let $num = parseInt(obj.parents('.goods-item').find('.quantity-form input').val());
                return ($dj * $num).toFixed(2)
            }


            //将改变后的数量存放到cookie中
            let arrsid = []; //存储商品的编号。
            let arrnum = []; //存储商品的数量。
            function cookietoarray() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    arrsid = $.cookie('cookiesid').split(','); //获取cookie 同时转换成数组。[1,2,3,4]
                    arrnum = $.cookie('cookienum').split(','); //获取cookie 同时转换成数组。[12,13,14,15]
                } else {
                    arrsid = [];
                    arrnum = [];
                }
            }

            function setcookie(obj) {
                cookietoarray();
                let $sid = obj.parents('.goods-item').find('img').attr('sid');
                arrnum[$.inArray($sid, arrsid)] = obj.parents('.goods-item').find('.quantity-form input').val();
                jscookie.add('cookienum', arrnum, 10);
            }


            //6.删除
            function delcookie(sid, arrsid) { //sid:当前删除的sid  arrsid:存放sid的数组[3,5,6,7]
                let $index = -1; //删除的索引位置
                $.each(arrsid, function(index, value) {
                    if (sid === value) {
                        $index = index;
                    }
                });
                arrsid.splice($index, 1);
                arrnum.splice($index, 1);

                jscookie.add('cookiesid', arrsid, 10);
                jscookie.add('cookienum', arrnum, 10);
            }
            $('.b-action a').on('click', function() {
                cookietoarray();
                if (window.confirm('你确定要删除吗?')) {
                    $(this).parents('.goods-item').remove();
                    delcookie($(this).parents('.goods-item').find('img').attr('sid'), arrsid);
                    calcprice(); //计算总价
                }
            });

            $('.operation a').on('click', function() {
                cookietoarray();
                if (window.confirm('你确定要全部删除吗?')) {
                    $('.goods-item:visible').each(function() {
                        if ($(this).find(':checkbox').is(':checked')) { //判断复选框是否选中
                            $(this).remove();
                            delcookie($(this).find('img').attr('sid'), arrsid);
                        }
                    });
                    calcprice(); //计算总价
                }
            });
        }(jQuery);
    })
})