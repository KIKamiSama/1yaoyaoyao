require(['config'], function() {
    require(['jquery'], function() {
        ! function($) {
            const btns = $('.tab-title ul li'); //存储元素4个
            const items = $('.tab-content'); //4个
            //所有的按钮添加事件
            btns.on('click', function() {
                //当前的元素添加active,其他的兄弟元素移除active
                $(this).addClass('active').siblings('.tab-title ul li').removeClass('active');
                //$(this).index():获取当前按钮的索引
                items.eq($(this).index()).show().siblings('.tab-content').hide();
            });
        }(jQuery);
    })
})