require(['config'], function() {
    require(['jquery'], function() {
        ! function($) {
            //1.滚轮事件控制左侧楼梯的显示和隐藏
            //直接刷新，满足情况
            function scroll() {
                let top = $(window).scrollTop(); //滚动条的top值。
                top >= 700 ? $('.elevator').show() : $('.elevator').hide();
                $('.floor').each(function(index, element) {
                    let loucengtop = $(this).offset().top; //每一个楼层的top值
                    if (loucengtop >= top) {
                        $('.elevator li').removeClass('active');
                        $('.elevator li').eq($(this).index()).addClass('active');
                        return false; //返回 'false' 将停止循环，有一个满足条件终止循环。
                    }
                });
            }
            scroll();
            //滚轮事件触发
            $(window).on('scroll', function() {
                scroll();
            });

            //2.点击左侧楼梯上面的按钮，右侧楼层运动到对应的位置。
            //求每一个楼层top位置。将固定的top值给滚动条的top值。document.documentElement.scrollTop

            $('.elevator li').not('.last').on('click', function() {
                $(this).addClass('active').siblings().removeClass('active');
                let loucengtop = $('.floor').eq($(this).index()).offset().top; //获取楼梯对应楼层固定的top值。
                $('html').animate({
                    scrollTop: loucengtop //运动不仅可以改变css，还可以设置html属性
                });
            });

            // 4.回到今日限购。
            $('.first').on('click', function() {
                $('html').animate({
                    scrollTop: 630 //运动不仅可以改变css，还可以设置html属性
                });
            });
        }(jQuery);
    })
})